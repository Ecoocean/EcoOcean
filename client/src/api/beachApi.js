function addBeach(name, altitude, longitude, cb) {
    fetch(`/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation {
            addBeach(name: ${name}, altitude: "${altitude}", longitude: ${longitude}) {
            name
            altitude
            longitude
          }
        }`,
      }),
    })
      .then(res => res.json())
      .then(res => cb(res.data))
      .catch(console.error)
}