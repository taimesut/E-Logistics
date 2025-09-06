const ConvertStatus = {
    CREATED: "Tạo đơn hàng thành công",
    CANCELLED: "Đơn hàng đã bị hủy",
    PICKUP_IN_PROGRESS: "Shipper đang lấy hàng từ người gửi",
    PICKUP_FAILED: "Lấy hàng thất bại",
    PICKUP_SUCCESS: "Lấy hàng thành công",
    AT_FROM_BRANCH: "Đơn đã đến bưu cục lấy hàng",
    AT_TO_BRANCH: "Đơn đã đến bưu cục giao hàng",
    AT_SORTING_CENTER: "Đơn đã đến trung tâm phân loại",
    IN_TRANSIT_TO_TO_BRANCH: "Đang vận chuyển tới bưu cục lấy hàng",
    IN_TRANSIT_TO_FROM_BRANCH: "Đang vận chuyển tới trung tâm phân loại",
    IN_TRANSIT_TO_SORTING_CENTER: "Đang vận chuyển tới bưu cục giao hàng",
    DELIVERY_IN_PROGRESS: "Shipper đang giao hàng cho người nhận",
    DELIVERY_FAILED: "Giao hàng thất bại",
    DELIVERED: "Giao hàng thành công",
    RETURN_REQUESTED: "Yêu cầu trả hàng",
    RETURN_IN_PROGRESS: "Đơn hàng đang được hoàn trả về người gửi",
    RETURNED: "Đơn hàng đã hoàn trả thành công",
};

export default function GetStatusDescription(status, reason = "") {
    let message = ConvertStatus[status] || status;
    if (message.includes("%s") && reason) {
        message = message.replace("%s", reason);
    }
    return message;
}
