package com.ntt.elogistics.exceptions;

import org.springframework.http.HttpStatus;

public class AccountLockedException extends CustomException {
    public AccountLockedException() {
        super("Tài khoản đã bị khóa", HttpStatus.FORBIDDEN);
    }
}
