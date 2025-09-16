package com.ntt.elogistics.dtos;

import com.ntt.elogistics.enums.ParcelStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParcelStatusCountDto {
    private ParcelStatus status;
    private long count;
}
