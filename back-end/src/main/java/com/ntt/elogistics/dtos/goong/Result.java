package com.ntt.elogistics.dtos.goong;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    private String formatted_address;
    private Geometry geometry;
    private String place_id;
}
