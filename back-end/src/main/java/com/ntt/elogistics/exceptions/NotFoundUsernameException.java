package com.ntt.elogistics.exceptions;

import org.springframework.http.HttpStatus;

public class NotFoundUsernameException extends CustomException {
    public NotFoundUsernameException() {
        super("Không tìm thấy tài khoản người dùng", HttpStatus.NOT_FOUND);
    }
}
