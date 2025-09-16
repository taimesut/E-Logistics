const CustomerConvertStatus = {
    CREATED: "Tạo đơn hàng thành công",
    CANCELLED: "Đơn hàng đã bị hủy",
    PICKUP_IN_PROGRESS: "Shipper đến lấy hàng",
    PICKUP_FAILED: "Lấy hàng thất bại",
    PICKUP_SUCCESS: "Lấy hàng thành công",
    AT_FROM_BRANCH: "Đơn đã đến bưu cục lấy hàng",
    AT_TO_BRANCH: "Đơn đã đến bưu cục giao hàng",
    IN_TRANSIT_TO_TO_BRANCH: "Đang vận chuyển tới bưu cục giao hàng",
    IN_TRANSIT_TO_FROM_BRANCH: "Đang vận chuyển tới bưu cục lấy hàng",
    DELIVERY_IN_PROGRESS: "Shipper đang giao hàng",
    DELIVERY_FAILED: "Giao hàng thất bại",
    DELIVERED: "Giao hàng thành công",
    RETURNED: "Đơn hàng đã hoàn trả",
};

const ManagerConvertStatus = {
    CREATED: "Chưa gán Shipper lấy",
    CANCELLED: "Đơn đã bị hủy",
    PICKUP_IN_PROGRESS: "Shipper đang lấy hàng",
    PICKUP_FAILED: "Lấy hàng thất bại",
    PICKUP_SUCCESS: "Lấy hàng thành công",
    AT_FROM_BRANCH: "Đơn đã đến bưu cục lấy hàng",
    AT_TO_BRANCH: "Đơn đã đến bưu cục giao hàng",
    IN_TRANSIT_TO_TO_BRANCH: "Đang vận chuyển tới bưu cục giao hàng",
    IN_TRANSIT_TO_FROM_BRANCH: "Đang vận chuyển tới bưu cục lấy hàng",
    DELIVERY_IN_PROGRESS: "Shipper đang giao hàng",
    DELIVERY_FAILED: "Giao hàng thất bại",
    DELIVERED: "Giao hàng thành công",
    RETURNED: "Đơn hàng đã hoàn trả",
};

const ShipperConvertStatus = {
    CANCELLED: "Đơn đã bị hủy",
    PICKUP_IN_PROGRESS: "Đang lấy",
    PICKUP_FAILED: "Lấy thất bại",
    PICKUP_SUCCESS: "Lấy thành công",
    AT_FROM_BRANCH: "Đơn đã đến bưu cục lấy hàng",
    AT_TO_BRANCH: "Đơn đã đến bưu cục giao hàng",
    IN_TRANSIT_TO_TO_BRANCH: "Đang vận chuyển tới bưu cục giao hàng",
    IN_TRANSIT_TO_FROM_BRANCH: "Đang vận chuyển tới bưu cục lấy hàng",
    DELIVERY_IN_PROGRESS: "Đang giao",
    DELIVERY_FAILED: "Giao hàng thất bại",
    DELIVERED: "Giao hàng thành công",
    RETURNED: "Đơn hàng đã hoàn trả",
};

export default function GetStatusDescription(status, role) {
    if(role === "CUSTOMER"){
        return CustomerConvertStatus[status] || status;
    }else if(role === "MANAGER"){
        return ManagerConvertStatus[status] || status;
    }else if(role === "SHIPPER"){
        return ShipperConvertStatus[status] || status;
    }
    return status;
}
