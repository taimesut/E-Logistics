package com.ntt.elogistics.dtos.goong;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeocodeResponse {
    private List<Result> results;
    private String status;
}