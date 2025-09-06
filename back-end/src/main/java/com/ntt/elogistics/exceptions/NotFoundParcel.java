package com.ntt.elogistics.exceptions;

import org.springframework.http.HttpStatus;

public class NotFoundParcel extends CustomException {
    public NotFoundParcel(String id) {
        super("Không tìm thấy đơn hàng: " + id, HttpStatus.BAD_REQUEST);
    }
    public NotFoundParcel(){
        super("Không tìm thấy đơn hàng",HttpStatus.BAD_REQUEST);
    }
}
