package org.cms.Dashboard.Models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardReport {

    private int doctorCount;

    private int patientCount;

    private int pharmacistCount;

    private int receptionistCount;

    private int todayAppointmentCount;

    private int todayInvoiceCount;

    private int lowStockMedicineCount;

    private int todayIncomeCount;
}
