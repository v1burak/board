export const callAPI = async (apiOptions) => {
    try {
        const options = {
            method: apiOptions.method,
            headers: apiOptions.headers
        };

        if (apiOptions.data !== '') {
            options.body = apiOptions.data;
        }

        let result = await fetch(apiOptions.url, options);
        let response = await result.json();

        if (response.error) {
            apiOptions.errorCallback(response);
        } else {
            apiOptions.successCallback(response);
        }

    } catch (error) {
        console.log(error);
        apiOptions.exceptionCallback(error);
    }
};