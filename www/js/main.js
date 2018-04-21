function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      handleLocationFound,
      handleLocationError
    );
  } else {
    handleLocationError(err);
  }

  function handleLocationFound(position) {
    const pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    console.log(pos);
  }

  function handleLocationError(err) {
    console.log(err);
  }
}
