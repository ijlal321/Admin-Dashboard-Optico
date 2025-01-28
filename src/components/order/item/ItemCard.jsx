import React, {useState} from 'react'
import "./items.css";
import ContactLensLoader from './productLoader/ContactLensLoader';
import FrameLoader from './productLoader/FrameLoader';
import SunglassLoader from './productLoader/SunglassLoader';
import ReadingGlassesLoader from './productLoader/ReadingGlassesLoader';
import OtherLoader from './productLoader/OtherLoader';
import CurrentStatusComponent from '@/components/helpers/CurrentStatusComponent';

function ItemCard({item, setItem, isEditable, status, setStatus, contactLensData}) {
  return (
    <div >
      {item.itemType == 'Contact Lens' &&
        <ContactLensLoader item={item} setItem={setItem} isEditable={isEditable} setStatus={setStatus} contactLensData={contactLensData} />
      }

      {item.itemType == 'Prescription Glasses' && 
        <FrameLoader item={item} setItem={setItem} isEditable={isEditable} setStatus={setStatus} />
      }

      {item.itemType == 'Sunglass' && 
        <SunglassLoader item={item} setItem={setItem} isEditable={isEditable} setStatus={setStatus} />
      }

      {item.itemType == 'Reading Glasses' &&  (
        <ReadingGlassesLoader item={item} setItem={setItem} isEditable={isEditable} setStatus={setStatus} />
      )}

      {item.itemType == 'Other' && (
       <OtherLoader item={item} setItem={setItem} isEditable={isEditable} /> 
      )}
    </div>
  )
}

export default ItemCard