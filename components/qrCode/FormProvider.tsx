import { ReactNode } from "react";
import { EmailForm } from "./EmailForm";
import { TextForm } from "./TextForm";
import { URLForm } from "./URLForm";
import { VCardForm } from "./VCardForm";
import { WiFiForm } from "./WiFiForm";

type QRCodeType = "url" | "vcard" | "text" | "email" | "wifi";

interface FormProviderProps {
  type: QRCodeType;
  content: string;
  isReadOnly?: boolean;
  onContentChange: (content: string) => void;

  // URL form
  url: string;
  onUrlChange: (url: string) => void;

  // Email form
  emailAddress: string;
  emailSubject: string;
  emailMessage: string;
  onEmailAddressChange: (email: string) => void;
  onEmailSubjectChange: (subject: string) => void;
  onEmailMessageChange: (message: string) => void;

  // VCard form
  firstName: string;
  lastName: string;
  mobile: string;
  phone: string;
  fax: string;
  email: string;
  company: string;
  jobTitle: string;
  street: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  website: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onMobileChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onFaxChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onJobTitleChange: (value: string) => void;
  onStreetChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onZipChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;

  // WiFi form
  ssid: string;
  password: string;
  isHidden: boolean;
  encryption: "WPA" | "WEP" | "nopass";
  onSsidChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onIsHiddenChange: (value: boolean) => void;
  onEncryptionChange: (value: "WPA" | "WEP" | "nopass") => void;
}

export const FormProvider = ({
  type,
  content,
  isReadOnly = false,
  onContentChange,
  url,
  onUrlChange,
  emailAddress,
  emailSubject,
  emailMessage,
  onEmailAddressChange,
  onEmailSubjectChange,
  onEmailMessageChange,
  firstName,
  lastName,
  mobile,
  phone,
  fax,
  email,
  company,
  jobTitle,
  street,
  city,
  zip,
  state,
  country,
  website,
  onFirstNameChange,
  onLastNameChange,
  onMobileChange,
  onPhoneChange,
  onFaxChange,
  onEmailChange,
  onCompanyChange,
  onJobTitleChange,
  onStreetChange,
  onCityChange,
  onZipChange,
  onStateChange,
  onCountryChange,
  onWebsiteChange,
  ssid,
  password,
  isHidden,
  encryption,
  onSsidChange,
  onPasswordChange,
  onIsHiddenChange,
  onEncryptionChange,
}: FormProviderProps): ReactNode => {
  switch (type) {
    case "url":
      return <URLForm url={url} onUrlChange={onUrlChange} />;

    case "vcard":
      return (
        <VCardForm
          firstName={firstName}
          lastName={lastName}
          mobile={mobile}
          phone={phone}
          fax={fax}
          email={email}
          company={company}
          jobTitle={jobTitle}
          street={street}
          city={city}
          zip={zip}
          state={state}
          country={country}
          website={website}
          onFirstNameChange={onFirstNameChange}
          onLastNameChange={onLastNameChange}
          onMobileChange={onMobileChange}
          onPhoneChange={onPhoneChange}
          onFaxChange={onFaxChange}
          onEmailChange={onEmailChange}
          onCompanyChange={onCompanyChange}
          onJobTitleChange={onJobTitleChange}
          onStreetChange={onStreetChange}
          onCityChange={onCityChange}
          onZipChange={onZipChange}
          onStateChange={onStateChange}
          onCountryChange={onCountryChange}
          onWebsiteChange={onWebsiteChange}
        />
      );

    case "email":
      return (
        <EmailForm
          emailAddress={emailAddress}
          emailSubject={emailSubject}
          emailMessage={emailMessage}
          onEmailAddressChange={onEmailAddressChange}
          onEmailSubjectChange={onEmailSubjectChange}
          onEmailMessageChange={onEmailMessageChange}
        />
      );

    case "wifi":
      return (
        <WiFiForm
          ssid={ssid}
          password={password}
          isHidden={isHidden}
          encryption={encryption}
          onSsidChange={onSsidChange}
          onPasswordChange={onPasswordChange}
          onIsHiddenChange={onIsHiddenChange}
          onEncryptionChange={onEncryptionChange}
        />
      );

    case "text":
    default:
      return (
        <TextForm
          content={content}
          onContentChange={onContentChange}
          isReadOnly={isReadOnly}
        />
      );
  }
};
