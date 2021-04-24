const PostData = async (url = '', data={})=>{
  let currentDateTime = Date.now();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Current-DateTime': currentDateTime
    },
    body: JSON.stringify(data)
  });
  if(response.status === 200) return response.json();
  return [];
}

export default PostData;