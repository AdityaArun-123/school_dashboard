package com.demo.jwt.authify.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransportRequest {
    private String busNo;
    private String routeNumber;
    private String driverName;
    private String licenseNumber;
    private Long phoneNumber;
}
