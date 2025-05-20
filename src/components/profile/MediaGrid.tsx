
// Update the UniversalMedia component call
<UniversalMedia
  item={{
    url: item.url,
    type: item.type,
    // Use optional chaining for thumbnail
    ...(item.thumbnail ? { thumbnail: item.thumbnail } : {})
  }}
  className="w-full h-full object-cover"
  showWatermark={false}
  onClick={() => onItemClick(item)}
/>
