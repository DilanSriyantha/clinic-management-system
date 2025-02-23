package org.cms.PharmacyManagement.View;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class PharmacyGUI {
    private JTable table1;
    private JButton searchButton;
    private JTextField search;
    private JButton addNewButton;
    private JButton deleteButton;
    private JButton updateButton;
    private JButton homeButton;
    private JTextField medName;
    private JTextField storeLoc;
    private JTextField medId;
    private JTextField medCompany;
    private JTextField phnNumber;
    private JTextField price;
    private JTextField quantity;
    private JTextField expDate;
    private JButton billingButton;


    public void initialize(){
        JFrame frame = new JFrame("Pharmacy Management System");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        frame.pack();
        frame.setVisible(true);
    }

    public PharmacyGUI() {
        addNewButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

            }
        });
        deleteButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

            }
        });
        updateButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

            }
        });
        homeButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

            }
        });
        searchButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

            }
        });
        billingButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

            }
        });
    }
}
