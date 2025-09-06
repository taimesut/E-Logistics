package com.ntt.elogistics.exceptions;

import org.springframework.http.HttpStatus;

public class UsernameAlreadyExistsException extends CustomException {
  public UsernameAlreadyExistsException() {
    super("Tên tài khoản đã tồn tại", HttpStatus.BAD_REQUEST);
  }
}
