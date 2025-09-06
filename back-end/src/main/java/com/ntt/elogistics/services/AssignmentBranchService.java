package com.ntt.elogistics.services;

import com.ntt.elogistics.models.Branch;
import com.ntt.elogistics.models.Parcel;
import com.ntt.elogistics.repositories.BranchRepository;
import com.ntt.elogistics.repositories.ParcelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssignmentBranchService {

    private final BranchRepository branchRepository;

    private final ParcelRepository parcelRepository;


    public String getFromBranchIdAutoAssignment(Parcel parcel){
        Branch branch = null;

        if (parcel.getFromWard() != null && !parcel.getFromWard().isEmpty()) {
            branch = branchRepository.findByProvinceAndDistrictAndWard(
                    parcel.getFromProvince(),
                    parcel.getFromDistrict(),
                    parcel.getFromWard()
            );
        }

        if (branch == null && parcel.getFromDistrict() != null && !parcel.getFromDistrict().isEmpty()) {
            branch = branchRepository.findByProvinceAndDistrict(
                    parcel.getFromProvince(),
                    parcel.getFromDistrict()
            );
        }

        if (branch == null) {
            branch = branchRepository.findByProvince(parcel.getFromProvince());
        }

        if (branch == null) {
            return null;
        }

        return String.valueOf(branch.getId());
    }

    public String getToBranchIdAutoAssignment(Parcel parcel){
        Branch branch = null;

        if (parcel.getToWard() != null && !parcel.getToWard().isEmpty()) {
            branch = branchRepository.findByProvinceAndDistrictAndWard(
                    parcel.getToProvince(),
                    parcel.getToDistrict(),
                    parcel.getToWard()
            );
        }

        if (branch == null && parcel.getToDistrict() != null && !parcel.getToDistrict().isEmpty()) {
            branch = branchRepository.findByProvinceAndDistrict(
                    parcel.getToProvince(),
                    parcel.getToDistrict()
            );
        }

        if (branch == null) {
            branch = branchRepository.findByProvince(parcel.getToProvince());
        }

        if (branch == null) {
            return null;
        }

        return String.valueOf(branch.getId());
    }
}
