const input = document.getElementById('searchTextField');


export const getLocations = input => {
    return new Promise((resolve, reject) => {
        if (!input) return resolve([]);
        if(window.google) {
            const AutocompleteService = new window.google.maps.places.AutocompleteService();
            AutocompleteService.getPlacePredictions({input}, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    let data = results.map(item => ({value: item, label: item.description}));
                    return resolve(data);
                } else {
                    return resolve([]);
                }
            });
        } else {
            return resolve([]);
        }
    });
};