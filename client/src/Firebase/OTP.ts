import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  UserCredential,
} from "./firebase.config";
import Swal from "sweetalert2";
import axiosPublic from "../hook/axiosPublic";
import { UserRegister, User } from "../AuthContext/auth.provider";

interface CustomWindow extends Window {
  recaptchaVerifier?: RecaptchaVerifier;
  recaptchaWidgetId?: number;
}

interface ConfirmationResult {
  confirm: (verificationCode: string) => Promise<UserCredential>;
}

declare let window: CustomWindow;

const sendOTP = async (
  phone: string,
  openInputOTP: () => void,
  invalidMessageOTP: () => void
): Promise<ConfirmationResult | undefined> => {
  const recaptchaContainer = document.getElementById("reCAPTCHA");

  if (!recaptchaContainer) {
    console.log("ไม่พบ element ที่ระบุสำหรับ reCAPTCHA");
    return;
  }

  let recaptchaVerifier = window.recaptchaVerifier;

  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer, {
      size: "normal",
      callback: () => {
        console.log("reCAPTCHA verify");
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired");
      },
    });

    window.recaptchaVerifier = recaptchaVerifier;

    recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  } else {
    console.log("reCAPTCHA ถูก render แล้ว");
  }

  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      recaptchaVerifier
    );
    console.log("OTP ส่งเรียบร้อยแล้ว");
    openInputOTP();
    return confirmationResult;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการส่ง OTP:", error);
    console.log(recaptchaVerifier);

    invalidMessageOTP();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to send OTP. Please try again.",
      customClass: {
        htmlContainer: 'swal-text'
      },
    }).then(() => {
      (
        document.getElementById("Get-Started") as HTMLDialogElement
      )?.showModal();
    });
  }
};

const verifyOTP = async (
  confirmationResult: ConfirmationResult,
  otp: string,
  invalidOTP: () => void,
  formatOTP: () => void,
  userData: UserRegister | null,
  onClose: () => void,
  changPassword: User | null
) => {
  try {
    const connect = await confirmationResult.confirm(otp);
    if (connect) {
      onClose();
      if (userData !== null) {
        try {
          const response = await axiosPublic.post(
            `/user/${userData.role}Register`,
            userData
          );

          if (!response) {
            throw new Error(`Error: can't register`);
          } else if (response) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Sign up successful! Pless cheack verify in Email..",
            });
          }
        } catch (error) {
          console.error("Error registering user:", error);
        }
      } else if (userData === null && changPassword !== null) {
        try {
          const { value: formValues } = await Swal.fire({
            title: "Enter your new password",
            html: `
            <div class="max-w-full rounded overflow-hidden shadow relative transform transition duration-300">
            <div class="relative mx-5 flex items-center justify-center">
                <input id="swal-input1" type="text" class="swal2-input w-full" placeholder="New password" style="-webkit-text-security:disc" >
                <span style="position: absolute; right: 50px; top: 63%; transform: translateY(-50%); cursor: pointer;" id="togglePassword1">
                  <i class="fas fa-eye-slash"></i>
                </span>
              </div>
              <div class="relative mx-5 flex items-center justify-center">
                <input id="swal-input2" type="text" class="swal2-input w-full" placeholder="Confirm password" style="-webkit-text-security:disc" >
                <span style="position: absolute; right: 50px; top: 63%; transform: translateY(-50%); cursor: pointer;" id="togglePassword2">
                  <i class="fas fa-eye-slash"></i>
                </span>
              </div>
            </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
              const newPassword = (
                document.getElementById("swal-input1") as HTMLInputElement
              ).value;
              const confirmPassword = (
                document.getElementById("swal-input2") as HTMLInputElement
              ).value;
              if (!newPassword || !confirmPassword) {
                Swal.showValidationMessage("You need to enter both passwords");
              } else if (newPassword.length < 8) {
                Swal.showValidationMessage(
                  "Password must be at least 8 characters long"
                );
              } else if (newPassword !== confirmPassword) {
                Swal.showValidationMessage("Passwords do not match");
              } else if (
                !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(
                  newPassword
                )
              ) {
                Swal.showValidationMessage(
                  "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be at least 8 characters long"
                );
              }
              return { newPassword };
            },
            didOpen: () => {
              let hide = true
              const togglePasswordVisibility = (id: string, iconId: string) => {
                const input = document.getElementById(id) as HTMLInputElement;
                const icon = document.getElementById(iconId) as HTMLElement;
        
                if (input && icon) {
                  hide = !hide;
        
                  if (hide) {
                    icon.innerHTML = '<i class="fas fa-eye-slash"></i>';
                    input.style.setProperty("-webkit-text-security", "disc");
                  } else {
                    icon.innerHTML = '<i class="fas fa-eye"></i>';
                    input.style.setProperty("-webkit-text-security", "none");
                  }
                }
              };
              document
                .getElementById("togglePassword1")
                ?.addEventListener("click", () =>
                  togglePasswordVisibility("swal-input1", "togglePassword1")
                );
              document
                .getElementById("togglePassword2")
                ?.addEventListener("click", () =>
                  togglePasswordVisibility("swal-input2", "togglePassword2")
                );
            },
          });

          if (formValues) {
            const newPassword = formValues.newPassword;
            const updatePassword = {
              password: newPassword,
              role: changPassword.role,
            };

            const response = await axiosPublic.put(
              `/user/updateUser/${changPassword._id}`,
              updatePassword
            );

            if (!response) {
              throw new Error(`Error: ${response}`);
            } else if (response) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Password change successful!",
              });
            }
          }
        } catch (error) {
          console.error("Error updating password:", error);
        }
      }
    } else {
      return;
    }
  } catch (error) {
    formatOTP();
    invalidOTP();
  }
};

export { sendOTP, verifyOTP };
export type { ConfirmationResult };
