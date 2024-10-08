import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { DataNav, PaymentData } from "../type";

interface PaymentContextType {
  paymentData: PaymentData | null;
  setPaymentData: (data: PaymentData) => void;
  dataNav: DataNav | null;
  setDataNav: (data: DataNav) => void;
}

interface PaymentProviderProps {
  children: ReactNode;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<PaymentProviderProps> = ({
  children,
}) => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [dataNav, setDataNav] = useState<DataNav | null>(null);

  // โหลดข้อมูลจาก localStorage เมื่อคอมโพเนนต์ถูกสร้างใหม่
  useEffect(() => {
    const savedPaymentData = localStorage.getItem("paymentData");
    if (savedPaymentData) {
      setPaymentData(JSON.parse(savedPaymentData));
    }

    const savedDataNav = localStorage.getItem("dataNav");
    if (savedDataNav) {
      setDataNav(JSON.parse(savedDataNav));
    }
  }, []);

  // บันทึกข้อมูลลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (dataNav) {
      localStorage.setItem("dataNav", JSON.stringify(dataNav));
    }
  }, [dataNav]);

  return (
    <PaymentContext.Provider
      value={{ paymentData, setPaymentData, dataNav, setDataNav }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePaymentContext must be used within a PaymentProvider");
  }
  return context;
};
