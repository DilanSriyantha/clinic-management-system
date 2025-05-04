package org.cms.PrescriptionManagement.Repositories;

import java.util.List;

import org.cms.PrescriptionManagement.DTOs.PrescriptionIssueDistributionDto;
import org.cms.PrescriptionManagement.DTOs.PrescriptionIssueTrend;
import org.cms.PrescriptionManagement.DTOs.PrescriptionSummaryDto;
import org.cms.PrescriptionManagement.Models.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
    
    @Query(value = """
        SELECT 
            u.id AS doctorId,
            u.reference_id AS doctorRefId,
            u.name AS doctorName,
            COUNT(p.id) AS prescriptionCount,
            ROUND(COUNT(p.id) * 100.0 / total.totalPrescriptions, 2) AS percentageOfTotal
        FROM prescription p
        JOIN user u ON p.doctor_id = u.id
        JOIN (
            SELECT COUNT(*) AS totalPrescriptions
            FROM prescription
        ) AS total
        GROUP BY u.id, u.name, total.totalPrescriptions
        ORDER BY prescriptionCount DESC
    """, nativeQuery = true)
    List<PrescriptionIssueDistributionDto> getPrescriptionIssueDistribution();

    @Query(value = """
        SELECT 
            DATE(created_at) AS prescriptionDate,
            COUNT(*) AS totalPrescriptions
        FROM prescription
        WHERE created_at BETWEEN :startDate AND :endDate
        GROUP BY DATE(created_at)
        ORDER BY prescriptionDate;          
    """, nativeQuery = true)
    List<PrescriptionIssueTrend> getPrescriptionIssueTrends(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Query(value = """
        SELECT 
            COUNT(DISTINCT p.id) AS totalPrescriptions,
            
            COUNT(DISTINCT CASE 
                WHEN p.created_at BETWEEN :startDate AND :endDate 
                THEN p.id 
            END) AS prescriptionsInPeriod,
            
            ROUND(AVG(itemCount), 2) AS avgItemsPerPrescription
        FROM prescription p
        LEFT JOIN (
            SELECT 
                prescription_id,
                COUNT(*) AS itemCount
            FROM prescription_line
            GROUP BY prescription_id
        ) pl ON pl.prescription_id = p.id;     
    """, nativeQuery = true)
    PrescriptionSummaryDto getPrescriptionSummary(@Param("startDate") String startDate, @Param("endDate") String endDate);
}
