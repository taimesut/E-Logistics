import AxiosClient from "../../services/AxiosClient.js";

const PublicApi = {
    tracking(code) {
        return AxiosClient.get('/public/tracking', {
            params: {code: code}
        });
    },
    check(data) {
        return AxiosClient.get('/public/check-fee', {
            params: data
        });
    },
    resetPassword(email) {
        return AxiosClient.get('/public/reset-password?email=' + email)
    },
    NewPassword(token, newPassword) {
        return AxiosClient.get('/public/confirm-reset-password?token=' + token + '&newPassword=' + newPassword)
    },
    ChangePassword(oldPassword, newPassword) {
        return AxiosClient.post("/user/change-password", {
            oldPassword,
            newPassword
        });
    },
    UploadAvatar(formData) {
        return AxiosClient.post("/user/upload-avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    updateAddress(address, ward, district, province) {
        return AxiosClient.get(`/user/update-address?address=${address}&ward=${ward}&district=${district}&province=${province}`  )
    },
    getShippingRule(){
        return AxiosClient.get(`/public/shipping-rule`);
    },
    getImagesParcel(id){
        return AxiosClient.get(`/user/images-parcel?id=${id}`);
    }
}

export default PublicApi;