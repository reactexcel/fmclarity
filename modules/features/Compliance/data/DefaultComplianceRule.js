export default DefaultComplianceRule = {
    "Building Maintenance Unit": [
        {
            "type": "Document is current",
            "service": {
                "name": "Building Maintenance Unit"
            },
            "docType": "Contract",
            "docName": "Building Maintenance Unit contract"
        },
        {
            "type": "PPM exists",
            "service": {
                "name": "Building Maintenance Unit"
            },
            "event": "Building Maintenance Unit PPM"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Building Maintenance Unit"
            },
            "docType": "Registration",
            "docName": "BMU registration renewal"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Building Maintenance Unit"
            },
            "docType": "Assessment",
            "docName": "BMU risk assessment"
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Building Maintenance Unit"
            },
            "event": "Building Maintenance Unit Major maintenance",
            "frequency": {
                "number": 10,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Building Maintenance Unit"
            },
            "docType": "Registration",
            "docName": "Building Maintenance Unit registration"
        }
    ],
    "Cleaning": [
        {
            "type": "Document is current",
            "service": {
                "name": "Cleaning"
            },
            "subservice": {
                "name": "Waste Removal"
            },
            "docType": "Contract",
            "docName": "Cleaning contract"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Cleaning"
            },
            "docType": "Contract",
            "docName": "Cleaning contract"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Cleaning"
            },
            "docType": "Registration",
            "docSubType": "Testing & Tagging certificate",
            "docName": "Cleaning Test and Tag certificates"
        }
    ],
    "Cooling Tower Systems & Water Treatment": [
        {
            "type": "Document is current",
            "service": {
                "name": "Cooling Tower Systems & Water Treatment"
            },
            "subservice": {
                "name": "Risk Management Plan"
            },
            "docType": "Management Plan",
            "docName": "Risk Management Plan (RMP)"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Cooling Tower Systems & Water Treatment"
            },
            "subservice": {
                "name": "Risk Management Plan"
            },
            "docType": "Assessment",
            "docName": "RMP Review"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Cooling Tower Systems & Water Treatment"
            },
            "subservice": {
                "name": "Risk Management Plan"
            },
            "docType": "Confirmation",
            "docName": "RMP review compliance report"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Cooling Tower Systems & Water Treatment"
            },
            "subservice": {
                "name": "Risk Management Plan"
            },
            "docType": "Audit",
            "docName": "RMP Audit"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Cooling Tower Systems & Water Treatment"
            },
            "subservice": {
                "name": "Water Testing"
            },
            "docType": "Contract",
            "docName": "Cooling Tower Systems & Water Treatment contract"
        },
        {
            "type": "PPM exists",
            "service": {
                "name": "Cooling Tower Systems & Water Treatment"
            },
            "subservice": {
                "name": "Water Testing"
            },
            "event": "Cooling Tower Systems & Water Treatment Water Testing PPM schedule"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Cooling Tower Systems & Water Treatment"
            },
            "subservice": {
                "name": "Water Treatment"
            },
            "docType": "Contract",
            "docName": "Cooling Tower Systems & Water Treatment contract"
        },
        {
            "type": "PPM exists",
            "service": {
                "name": "Cooling Tower Systems & Water Treatment"
            },
            "subservice": {
                "name": "Water Treatment"
            },
            "event": "Cooling Tower Systems & Water Treatment Water Treatment PPM schedule"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Cooling Tower Systems & Water Treatment"
            },
            "docType": "Registration",
            "docName": "Cooling tower registration"
        }
    ],
    "Electrical Services": [
        {
            "type": "Document is current",
            "service": {
                "name": "Electrical Services"
            },
            "subservice": {
                "name": "Lighting - Emergency & Exit"
            },
            "docType": "Contract",
            "docName": "Electrical Services contract"
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Electrical Services"
            },
            "subservice": {
                "name": "Lighting - Emergency & Exit"
            },
            "event": "Electrical Services Lighting - Emergency & Exit 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Electrical Services"
            },
            "subservice": {
                "name": "Generator"
            },
            "docType": "Contract",
            "docName": "Electrical Services contract"
        },
        {
            "type": "PPM exists",
            "service": {
                "name": "Electrical Services"
            },
            "subservice": {
                "name": "Generator"
            },
            "event": "Electrical Services Generator PPM schedule"
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Electrical Services"
            },
            "subservice": {
                "name": "Generator"
            },
            "event": "Generator Load Test",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Electrical Services"
            },
            "subservice": {
                "name": "Lightning Protection"
            },
            "event": "Electrical Services Lightning Protection Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Electrical Services"
            },
            "subservice": {
                "name": "Residual Current Devices"
            },
            "event": "Electrical Services Residual Current Devices Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Electrical Services"
            },
            "subservice": {
                "name": "Switchboard"
            },
            "event": "Electrical Services Switchboard Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Electrical Services"
            },
            "subservice": {
                "name": "Testing & Tagging"
            },
            "event": "Testing & Tagging",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Electrical Services"
            },
            "subservice": {
                "name": "Thermographic Scanning"
            },
            "event": "Electrical Services Thermographic Scanning Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Electrical Services"
            },
            "subservice": {
                "name": "Uninterruptible Power Supply"
            },
            "event": "UPS maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Electrical Services"
            },
            "docType": "Contract",
            "docName": "Electrical Services contract"
        },
        {
            "type": "PPM exists",
            "service": {
                "name": "Electrical Services"
            },
            "event": "Electrical Services  PPM schedule"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Electrical Services"
            },
            "docType": "SWMS",
            "docName": "Risk assessment"
        }
    ],
    "Emergency  Management": [
        {
            "type": "Document is current",
            "service": {
                "name": "Emergency  Management"
            },
            "docType": "Contract",
            "docName": "Emergency  Management contract"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Emergency  Management"
            },
            "docType": "Procedure",
            "docName": "Emergency Response Procedures"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Emergency  Management"
            },
            "docType": "Plan",
            "docName": "Images of evacuation diagrams installed"
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Emergency  Management"
            },
            "event": "Annual emergency evacuation training exercise",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Emergency  Management"
            },
            "docType": "Log",
            "docSubType": "Warden training",
            "docName": "Warden training log"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Emergency  Management"
            },
            "docType": "Log",
            "docSubType": "Chief Warden training",
            "docName": "Chief warden training log"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Emergency  Management"
            },
            "docType": "Register",
            "docName": "Emergency Planning Committee (EPC) meeting"
        }
    ],
    "Essential Safety Measures": [
        {
            "type": "Document is current",
            "service": {
                "name": "Essential Safety Measures"
            },
            "subservice": {
                "name": "Egress"
            },
            "docType": "Contract",
            "docName": "Essential Safety Measures contract"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Essential Safety Measures"
            },
            "docType": "Contract",
            "docName": "Essential Safety Measures contract"
        },
        {
            "type": "PPM exists",
            "service": {
                "name": "Essential Safety Measures"
            },
            "event": "Essential Safety Measures  PPM schedule"
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Essential Safety Measures"
            },
            "event": "Essential Safety Measures  Annual review and audit",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Essential Safety Measures"
            },
            "docType": "Report",
            "docName": "Annual essential safety measures report (AESMR)*"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Essential Safety Measures"
            },
            "docType": "Certificate",
            "docName": "Maintenance determination/occupancy permit"
        }
    ],
    "Fire Protection": [
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Emergency Planning"
            },
            "event": "Fire Protection Emergency Planning 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Emergency Planning"
            },
            "event": "Fire Protection Emergency Planning Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Extinguishers"
            },
            "event": "Fire Protection Extinguishers 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Extinguishers"
            },
            "event": "Fire Protection Extinguishers Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Extinguishers"
            },
            "event": "Fire Protection Extinguishers 5 yearly  maintenance",
            "frequency": {
                "number": 5,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Dampers"
            },
            "event": "Fire Protection Dampers Quarterly maintenance**",
            "frequency": {
                "number": 3,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Dampers"
            },
            "event": "Fire Protection Dampers 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Dampers"
            },
            "event": "Fire Protection Dampers Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Dampers"
            },
            "event": "Fire Protection Dampers 5 yearly  maintenance",
            "frequency": {
                "number": 5,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Blankets"
            },
            "event": "Fire Protection Blankets 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Detection & Alarm Systems"
            },
            "event": "Fire Protection Detection & Alarm Systems 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Detection & Alarm Systems"
            },
            "event": "Fire Protection Detection & Alarm Systems Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Detection & Alarm Systems"
            },
            "event": "Fire Protection Detection & Alarm Systems 5 yearly  maintenance",
            "frequency": {
                "number": 5,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Fire Doors"
            },
            "event": "Fire Protection Fire Doors 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Fire Doors"
            },
            "docType": "Contract",
            "docName": "Fire Protection contract"
        },
        {
            "type": "PPM exists",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Fire Doors"
            },
            "event": "Fire Protection Fire Doors PPM schedule"
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Fire Hose Reels"
            },
            "event": "Fire Protection Fire Hose Reels 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Hydrant Valves"
            },
            "event": "Fire Protection Hydrant Valves 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Hydrant Valves"
            },
            "event": "Fire Protection Hydrant Valves Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Hydrants"
            },
            "event": "Fire Protection Hydrants Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Hydrants"
            },
            "event": "Fire Protection Hydrants 5 yearly  maintenance",
            "frequency": {
                "number": 5,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Lay Flat Hose"
            },
            "event": "Fire Protection Lay Flat Hose Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Passive Fire & Smoke Systems"
            },
            "event": "Fire Protection Passive Fire & Smoke Systems Quarterly maintenance**",
            "frequency": {
                "number": 3,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Passive Fire & Smoke Systems"
            },
            "event": "Fire Protection Passive Fire & Smoke Systems 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Passive Fire & Smoke Systems"
            },
            "event": "Fire Protection Passive Fire & Smoke Systems Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Pumpsets"
            },
            "event": "Fire Protection Pumpsets 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Pumpsets"
            },
            "event": "Fire Protection Pumpsets Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Pumpsets"
            },
            "event": "Fire Protection Pumpsets 5 yearly  maintenance",
            "frequency": {
                "number": 5,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Pumpsets"
            },
            "event": "Fire Protection Pumpsets 10 yearly  maintenance",
            "frequency": {
                "number": 10,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Special Hazard Systems"
            },
            "event": "Fire Protection Special Hazard Systems 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Special Hazard Systems"
            },
            "event": "Fire Protection Special Hazard Systems Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Special Hazard Systems"
            },
            "event": "Fire Protection Special Hazard Systems 10 yearly  maintenance",
            "frequency": {
                "number": 10,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Sprinklers"
            },
            "event": "Fire Protection Sprinklers 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Sprinklers"
            },
            "event": "Fire Protection Sprinklers Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Sprinklers"
            },
            "event": "Fire Protection Sprinklers 5 yearly  maintenance",
            "frequency": {
                "number": 5,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Sprinklers"
            },
            "event": "Fire Protection Sprinklers 10 yearly  maintenance",
            "frequency": {
                "number": 10,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Sprinklers"
            },
            "event": "Fire Protection Sprinklers 25 yearly  maintenance"
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Sprinklers"
            },
            "event": "Fire Protection Sprinklers 30 yearly  maintenance"
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Water Storage Tanks"
            },
            "event": "Fire Protection Water Storage Tanks 6-monthly maintenance",
            "frequency": {
                "number": 6,
                "unit": "months",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Water Storage Tanks"
            },
            "event": "Fire Protection Water Storage Tanks Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Fire Protection"
            },
            "subservice": {
                "name": "Water Storage Tanks"
            },
            "event": "Fire Protection Water Storage Tanks 10 yearly  maintenance",
            "frequency": {
                "number": 10,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Fire Protection"
            },
            "docType": "Contract",
            "docName": "Fire Protection contract"
        },
        {
            "type": "PPM exists",
            "service": {
                "name": "Fire Protection"
            },
            "event": "Fire Protection  PPM monthly schedule"
        }
    ],
    "High Access": [
        {
            "type": "Document is current",
            "service": {
                "name": "High Access"
            },
            "subservice": {
                "name": "Anchor points"
            },
            "docType": "Contract",
            "docName": "High Access contract"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "High Access"
            },
            "subservice": {
                "name": "Façade"
            },
            "docType": "Audit",
            "docName": "Façade audit/inspection"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "High Access"
            },
            "subservice": {
                "name": "Height Safety"
            },
            "docType": "Report",
            "docName": "Height safety assessment"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "High Access"
            },
            "subservice": {
                "name": "Height Safety"
            },
            "docType": "Confirmation",
            "docName": "Height safety recommendations completed"
        }
    ],
    "Heating, Ventilation & Air Conditioning": [
        {
            "type": "Document is current",
            "service": {
                "name": "Heating, Ventilation & Air Conditioning"
            },
            "subservice": {
                "name": "Chillers"
            },
            "docType": "Registration",
            "docName": "Plant registraton renewal (Chiller)"
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Heating, Ventilation & Air Conditioning"
            },
            "subservice": {
                "name": "Kitchen Exhausts"
            },
            "event": "Heating, Ventilation & Air Conditioning Kitchen Exhausts Annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Heating, Ventilation & Air Conditioning"
            },
            "subservice": {
                "name": "Pressure Vessels"
            },
            "docType": "Registration",
            "docName": "Plant registraton renewal (Pressure vessels)"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Heating, Ventilation & Air Conditioning"
            },
            "docType": "Contract",
            "docName": "Heating, Ventilation & Air Conditioning contract"
        },
        {
            "type": "PPM exists",
            "service": {
                "name": "Heating, Ventilation & Air Conditioning"
            },
            "event": "Heating, Ventilation & Air Conditioning  PPM schedule"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Heating, Ventilation & Air Conditioning"
            },
            "docType": "SWMS",
            "docName": "Risk assessment"
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Heating, Ventilation & Air Conditioning"
            },
            "event": "Heating, Ventilation & Air Conditioning Full function fire test",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        }
    ],
    "Lifts & Escalators": [
        {
            "type": "Document is current",
            "service": {
                "name": "Lifts & Escalators"
            },
            "docType": "Contract",
            "docName": "Lifts & Escalators contract"
        },
        {
            "type": "PPM exists",
            "service": {
                "name": "Lifts & Escalators"
            },
            "event": "Lifts & Escalators  PPM schedule"
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Lifts & Escalators"
            },
            "event": "Annual Lift/escalator audit",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Lifts & Escalators"
            },
            "docType": "Audit",
            "docName": "Lift/escalator audit"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Lifts & Escalators"
            },
            "docType": "Registration",
            "docName": "Lift registration"
        }
    ],
    "Plumbing": [
        {
            "type": "PPM event completed",
            "service": {
                "name": "Plumbing"
            },
            "subservice": {
                "name": "Backflow Prevention Valves"
            },
            "event": "Backflow prevention valve annual maintenance",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Plumbing"
            },
            "subservice": {
                "name": "Potable Water Tank"
            },
            "event": "Potable water tank annual clean",
            "frequency": {
                "number": 1,
                "unit": "years",
                "repeats": 6
            }
        },
        {
            "type": "PPM event completed",
            "service": {
                "name": "Plumbing"
            },
            "subservice": {
                "name": "Thermostatic Mixer Valves"
            },
            "event": "Thermostatic mixer valves annual test"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Plumbing"
            },
            "docType": "Contract",
            "docName": "Plumbing contract"
        },
        {
            "type": "PPM exists",
            "service": {
                "name": "Plumbing"
            },
            "event": "Plumbing  PPM schedule"
        }
    ],
    "Security": [
        {
            "type": "Document is current",
            "service": {
                "name": "Security"
            },
            "docType": "Contract",
            "docName": "Security contract"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Security"
            },
            "docType": "Register",
            "docSubType": "Incident register",
            "docName": "Incident register"
        }
    ],
    "Underground Petroleum Storage Systems": [
        {
            "type": "Document is current",
            "service": {
                "name": "Underground Petroleum Storage Systems"
            },
            "subservice": {
                "name": "Groundwater Monitoring"
            },
            "docType": "Report",
            "docSubType": "Validation Report",
            "docName": "Groundwater monitoring validation report"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Underground Petroleum Storage Systems"
            },
            "subservice": {
                "name": "Leak Detection"
            },
            "docType": "Report",
            "docSubType": "Validation Report",
            "docName": "Leak detection system report"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Underground Petroleum Storage Systems"
            },
            "subservice": {
                "name": "Leak Detection"
            },
            "docType": "Log",
            "docName": "Leak detection log data"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Underground Petroleum Storage Systems"
            },
            "docType": "Contract",
            "docName": "Underground Petroleum Storage Systems contract"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Underground Petroleum Storage Systems"
            },
            "docType": "Management Plan",
            "docName": "Environmental management plan"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Underground Petroleum Storage Systems"
            },
            "docType": "Report",
            "docSubType": "Validation Report",
            "docName": "Decommissioning/validation test reports"
        }
    ],
    "Utilities": [
        {
            "type": "Document is current",
            "service": {
                "name": "Utilities"
            },
            "subservice": {
                "name": "Energy Management"
            },
            "docType": "Certificate",
            "docName": "Building Energy Efficiency Certificate"
        }
    ],
    "Workplace Health & Safety": [
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Asbestos & Hazardous Materials"
            },
            "docType": "Audit",
            "docName": "Asbestos/Haz mat register audit"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Asbestos & Hazardous Materials"
            },
            "docType": "Register",
            "docName": "Asbestos/Haz mat register included in induction"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Asbestos & Hazardous Materials"
            },
            "docType": "Management Plan",
            "docName": "Asbestos/Haz Mat Management Management plan"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Asbestos & Hazardous Materials"
            },
            "docType": "Procedure",
            "docName": "Occupant notification process"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Confined Spaces"
            },
            "docType": "Register",
            "docName": "Confined Spaces register"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Confined Spaces"
            },
            "docType": "Confirmation",
            "docName": "Confined Spaces identified and signposted"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Confined Spaces"
            },
            "docType": "Procedure",
            "docName": "Permit entry procedures in place"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Contractor Management"
            },
            "docType": "Procedure",
            "docSubType": "Restricted access",
            "docName": "Restricted access procedures"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Critical Environment"
            },
            "docType": "Audit",
            "docName": "Critical Environment audit"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Critical Environment"
            },
            "docType": "Register",
            "docName": "Equipment schedule"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Critical Environment"
            },
            "docType": "Procedure",
            "docName": "Critical Environment procedures"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Dangerous Goods & Hazardous Substances"
            },
            "docType": "Register",
            "docName": "Dangerous goods register"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Dangerous Goods & Hazardous Substances"
            },
            "docType": "MSDS",
            "docName": "Dangerous Goods & Hazardous Substances MSDS"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Dangerous Goods & Hazardous Substances"
            },
            "docType": "Confirmation",
            "docSubType": "Signage",
            "docName": "Dangerous Goods & Hazardous Substances Signage in place"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Dangerous Goods & Hazardous Substances"
            },
            "docType": "Confirmation",
            "docSubType": "Manifest",
            "docName": "Dangerous goods manifest in-situ"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Dangerous Goods & Hazardous Substances"
            },
            "docType": "Licence",
            "docName": "Dangerous goods license"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Dangerous Goods & Hazardous Substances"
            },
            "docType": "Assessment",
            "docName": "Dangerous goods risk review"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Dangerous Goods & Hazardous Substances"
            },
            "docType": "Confirmation",
            "docSubType": "Spill bins",
            "docName": "Emergency spill bins in place"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Dangerous Goods & Hazardous Substances"
            },
            "docType": "Confirmation",
            "docSubType": "Bunding",
            "docName": "Liquid substances are bunded to requirements"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Grease Trap Disposal"
            },
            "docType": "Contract",
            "docName": "Grease Trap Disposal contract"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Hazardous Waste"
            },
            "docType": "Register",
            "docName": "Hazardous waste register"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Hazardous Waste"
            },
            "docType": "Certificate",
            "docName": "Hazardous waste removal certificates"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Indoor Air Quality"
            },
            "docType": "Report",
            "docName": "Annual IAQ test"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Property Risk"
            },
            "docType": "Certificate",
            "docSubType": "Certificate of Occupancy",
            "docName": "Cert of Occupancy/Final Inspection/ESM determination"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Property Risk"
            },
            "docType": "Contract",
            "docName": "Workplace Health & Safety Property Risk contract"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Property Risk"
            },
            "docType": "Audit",
            "docName": "Property Risk audit"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Property Risk"
            },
            "docType": "Confirmation",
            "docName": "Property Risk  audit compliance report"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Radio Frequency Radiation"
            },
            "docType": "Assessment",
            "docName": "Radio Frequency Radiation Risk assessment"
        },
        {
            "type": "Document exists",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Radio Frequency Radiation"
            },
            "docType": "Procedure",
            "docName": "Radio Frequency Radiation Restricted access procedures"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Radio Frequency Radiation"
            },
            "docType": "Contract",
            "docName": "Radio Frequency Radiation contract"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Slip Test"
            },
            "docType": "Report",
            "docName": "Slip Test"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Slip Test"
            },
            "docType": "Confirmation",
            "docName": "Slip test compliance report"
        },
        {
            "type": "Document is current",
            "service": {
                "name": "Workplace Health & Safety"
            },
            "subservice": {
                "name": "Trade Waste"
            },
            "docType": "Contract",
            "docName": "Trade waste agreements"
        }
    ]
}