const BASE_URL = "https://open.oapi.vn/location";

const LocationApi = {
    getProvinces: async () => {
        try {
            const response = await fetch(`${BASE_URL}/provinces?size=63`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching provinces:", error);
            throw error;
        }
    },

    getDistricts: async (provinceId) => {
        try {
            const url = `${BASE_URL}/districts/${provinceId}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching districts:", error);
            throw error;
        }
    },

    getWards: async (districtId) => {
        try {
            const url = `${BASE_URL}/wards/${districtId}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching wards:", error);
            throw error;
        }
    }
};

export default LocationApi;
