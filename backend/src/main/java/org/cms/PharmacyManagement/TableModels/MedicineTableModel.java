package org.cms.PharmacyManagement.TableModels;

import org.cms.PharmacyManagement.Models.Medicine;

import javax.swing.table.AbstractTableModel;
import java.util.List;

public class MedicineTableModel extends AbstractTableModel{
    private final List<Medicine> medicines;
    private final String[] columnNames = {"ID","Name","Company","Phone Number","Price","Quantity","Exp Date","Store Location"};

    public MedicineTableModel(List<Medicine> medicines){this.medicines=medicines;}

    @Override
    public int getRowCount(){return this.medicines.size();}

    @Override
    public int getColumnCount(){return this.columnNames.length;}

    @Override
    public String getColumnName(int column){return this.columnNames[column];}

    @Override
    public Object getValueAt(int rowIndex, int columnIndex){
        Medicine medicine = this.medicines.get(rowIndex);
        switch (columnIndex){
            case 0: return medicine.getMedId();
            case 1: return medicine.getMedName();
            case 2: return medicine.getCompName();
            case 3: return medicine.getPhnNum();
            case 4: return medicine.getPrice();
            case 5: return medicine.getQuantity();
            case 6: return medicine.getExpDate();
            case 7: return medicine.getStoreLoc();
            default: throw new IllegalArgumentException("Invalid Column Index");
        }
    }

    @Override
    public boolean isCellEditable(int rowIndex, int columnIndex){
        super.isCellEditable(rowIndex,columnIndex);
        return false;
    }

    public Medicine getMedicineAt(int rowIndex){return this.medicines.get(rowIndex);}
}
