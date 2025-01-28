import { NextResponse } from 'next/server';
import dbConnect from '@/utlis/mongodb';
import Order from '@/models/order';
import Frame from '@/models/frame';
import Sunglass from '@/models/sunglass';
import ReadingGlass from '@/models/readingGlass';
import mongoose from 'mongoose';

// return latest 30 orders
export async function GET() {
    try {
        await dbConnect();
        const orders = await Order.find().sort({ updatedAt: -1 }).limit(30);
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ success: false, error: error.message });
    }
}



// delete order
export async function DELETE(req) {
    try {
        await dbConnect();
        const { id } = await req.json();
        const deletedOrder = await Order.findOneAndDelete({ id });
        if (!deletedOrder) {
            return NextResponse.json({ success: false, error: 'Order not found' });
        }
        return NextResponse.json({ success: true, data: deletedOrder });
    }
    catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json({ success: false, error: error.message });
    }
}

// update order
export async function PUT(req) {
    try {
        await dbConnect();
        const { id, ...body } = await req.json();
        const updatedOrder = await Order.findOneAndUpdate({ id }, body, { new: true });
        if (!updatedOrder) {
            return NextResponse.json({ success: false, error: 'Order not found' });
        }
        return NextResponse.json({ success: true, data: updatedOrder });
    }
    catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ success: false, error: error.message });
    }
}


// create new order
export async function POST(req) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await dbConnect();
        const body = await req.json();

        for (const item of body.items) {
            if (!item.itemId || item.itemId == '') continue;

            let result;
            if (item.itemType === 'Prescription Glasses') {
                result = await orderStockHelper(item, Frame, session);
            } else if (item.itemType === 'Sunglass') {
                result = await orderStockHelper(item, Sunglass, session);
            } else if (item.itemType === 'Reading Glasses') {
                result = await orderStockHelper(item, ReadingGlass, session);
            }

            if (!result.success) {
                await session.abortTransaction();
                await session.endSession(); // End session after abort
                return NextResponse.json({ success: false, error: `${item.itemType}: ${result.error}` });
            }
        }

        const order = await Order.create([body], { session }); // Include session
        await session.commitTransaction();
        await session.endSession(); // End session after commit
        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        console.error('Error creating order:', error);
        await session.abortTransaction();
        await session.endSession(); // End session after abort
        return NextResponse.json({ success: false, error: error.message });
    }
}


// Helper function to order stock
const orderStockHelper = async (item, Schema, session) => {
    let product = await Schema.findOne({ id: item.itemId }).session(session); // Include session
    if (!product) {
        return { success: false, error: 'Not found.' };
    }

    const variant = product.variants.find(variant => variant.variantId === item.variantId);
    if (!variant) {
        return { success: false, error: 'Variant not found.' };
    }
    const inventory = variant.inventory.find(inventory => inventory.inventoryId === item.inventoryId);
    if (!inventory) {
        return { success: false, error: 'Inventory not found.' };
    }
    if (inventory.stock < 1) {
        return { success: false, error: 'Out of stock.' };
    }

    product = await Schema.findOneAndUpdate(
        { id: item.itemId, 'variants.variantId': item.variantId, 'variants.inventory.inventoryId': item.inventoryId },
        {
            $inc: { 'variants.$.inventory.$[inv].stock': -1 }
        },
        {
            new: true,
            arrayFilters: [{ 'inv.inventoryId': item.inventoryId }], // Apply the filter for inventoryId inside the variant
            returnDocument: 'after', // Return the document after the update
            session // Add session to ensure the operation is part of the transaction
        }
    );

    if (!product) {
        return { success: false, error: 'Update failed.' };
    }

    return { success: true, data: product };
};


