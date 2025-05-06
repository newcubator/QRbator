import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "~/components/Button";
import { FormProvider, TagInput, TypeSelector } from "~/components/qrCode";
import { QRCodeEntry } from "~/core/qrCode";
import { addQRCode, getQRCodeById, updateQRCode } from "~/core/qrCodeStorage";

export default function AddEditQRCodeScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    id?: string;
    content?: string;
    type?: string;
    origin?: string;
  }>();

  const [name, setName] = useState("");
  const [content, setContent] = useState(params.content || "");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCodeType, setQRCodeType] = useState<
    "url" | "vcard" | "text" | "email" | "wifi"
  >((params.type as "url" | "vcard" | "text" | "email" | "wifi") || "text");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");

  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const [url, setUrl] = useState("");

  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [encryption, setEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");

  useEffect(() => {
    const fetchQRCode = async () => {
      if (params.id) {
        setIsEditing(true);
        setLoading(true);
        try {
          const qrCode = await getQRCodeById(params.id);
          if (qrCode) {
            setName(qrCode.name);
            setContent(qrCode.content);
            setDescription(qrCode.description || "");
            setTags(qrCode.tags);

            if (qrCode.type) {
              setQRCodeType(qrCode.type);

              if (qrCode.type === "url") {
                setUrl(qrCode.content);
              } else if (qrCode.type === "vcard") {
                try {
                  const lines = qrCode.content.split("\n");
                  for (const line of lines) {
                    if (line.startsWith("FN:")) {
                      const fullName = line.substring(3).split(" ");
                      setFirstName(fullName[0] || "");
                      setLastName(fullName.slice(1).join(" ") || "");
                    } else if (line.startsWith("TEL;CELL:")) {
                      setMobile(line.substring(9));
                    } else if (line.startsWith("TEL;WORK:")) {
                      setPhone(line.substring(9));
                    } else if (line.startsWith("TEL;FAX:")) {
                      setFax(line.substring(8));
                    } else if (line.startsWith("EMAIL:")) {
                      setEmail(line.substring(6));
                    } else if (line.startsWith("ORG:")) {
                      setCompany(line.substring(4));
                    } else if (line.startsWith("TITLE:")) {
                      setJobTitle(line.substring(6));
                    } else if (line.startsWith("ADR:;;")) {
                      const address = line.substring(6).split(";");
                      setStreet(address[0] || "");
                      setCity(address[1] || "");
                      setState(address[2] || "");
                      setZip(address[3] || "");
                      setCountry(address[4] || "");
                    } else if (line.startsWith("URL:")) {
                      setWebsite(line.substring(4));
                    }
                  }
                } catch (error) {
                  console.error("Error parsing vCard:", error);
                }
              } else if (qrCode.type === "email") {
                try {
                  const mailtoRegex =
                    /^mailto:([^?]*)(?:\?subject=([^&]*))?(?:&body=(.*))?$/;
                  const match = qrCode.content.match(mailtoRegex);
                  if (match) {
                    setEmailAddress(decodeURIComponent(match[1] || ""));
                    setEmailSubject(decodeURIComponent(match[2] || ""));
                    setEmailMessage(decodeURIComponent(match[3] || ""));
                  }
                } catch (error) {
                  console.error("Error parsing mailto:", error);
                }
              } else if (qrCode.type === "wifi") {
                try {
                  const wifiRegex = /WIFI:S:(.*?);T:(.*?);P:(.*?);H:(.*?);/;
                  const match = qrCode.content.match(wifiRegex);
                  if (match) {
                    setSsid(match[1] || "");
                    setEncryption(
                      (match[2] as "WPA" | "WEP" | "nopass") || "WPA"
                    );
                    setPassword(match[3] || "");
                    setIsHidden(match[4] === "true");
                  }
                } catch (error) {
                  console.error("Error parsing WiFi:", error);
                }
              } else {
                setContent(qrCode.content);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching QR code:", error);
          Alert.alert(t("error"), t("fetchFailed"));
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQRCode();
  }, [params.id, t]);

  const generateContent = () => {
    switch (qrCodeType) {
      case "url":
        return url;
      case "vcard":
        return `BEGIN:VCARD
              VERSION:3.0
              FN:${firstName} ${lastName}
              TEL;CELL:${mobile}
              TEL;WORK:${phone}
              TEL;FAX:${fax}
              EMAIL:${email}
              ORG:${company}
              TITLE:${jobTitle}
              ADR:;;${street};${city};${state};${zip};${country}
              URL:${website}
              END:VCARD`;
      case "email":
        return `mailto:${emailAddress}?subject=${encodeURIComponent(
          emailSubject
        )}&body=${encodeURIComponent(emailMessage)}`;
      case "wifi":
        return `WIFI:S:${ssid};T:${encryption};P:${password};H:${
          isHidden ? "true" : "false"
        };`;
      case "text":
      default:
        return content;
    }
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert(t("error"), t("nameRequired"));
      return;
    }

    const generatedContent = generateContent();

    if (!generatedContent) {
      Alert.alert(t("error"), t("contentRequired"));
      return;
    }

    try {
      const qrCode: QRCodeEntry = {
        id: params.id || Date.now().toString(),
        name,
        content: generatedContent,
        type: qrCodeType,
        tags,
        description,
        createdAt: new Date().toISOString(),
      };

      if (isEditing) {
        await updateQRCode(qrCode);
      } else {
        await addQRCode(qrCode);
      }

      if (params.origin === "scan") {
        router.dismissAll();
      } else {
        router.dismiss();
      }
    } catch (error) {
      console.error("Error saving QR code:", error);
      Alert.alert(t("error"), t("saveFailed"));
    }
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-corp-white">
        <Text>{t("loading")}</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      className="bg-corp-white"
    >
      <Stack.Screen
        options={{
          title: isEditing ? t("editQRCode") : t("addQRCode"),
          presentation: "formSheet",
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          className="flex-1 px-6 py-4"
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={true}
        >
          {!isEditing && (
            <TypeSelector
              selectedType={qrCodeType}
              onTypeSelect={setQRCodeType}
            />
          )}

          <FormProvider
            type={qrCodeType}
            content={content}
            isReadOnly={isEditing || !!params.content}
            onContentChange={setContent}
            url={url}
            onUrlChange={setUrl}
            emailAddress={emailAddress}
            emailSubject={emailSubject}
            emailMessage={emailMessage}
            onEmailAddressChange={setEmailAddress}
            onEmailSubjectChange={setEmailSubject}
            onEmailMessageChange={setEmailMessage}
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
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onMobileChange={setMobile}
            onPhoneChange={setPhone}
            onFaxChange={setFax}
            onEmailChange={setEmail}
            onCompanyChange={setCompany}
            onJobTitleChange={setJobTitle}
            onStreetChange={setStreet}
            onCityChange={setCity}
            onZipChange={setZip}
            onStateChange={setState}
            onCountryChange={setCountry}
            onWebsiteChange={setWebsite}
            ssid={ssid}
            password={password}
            isHidden={isHidden}
            encryption={encryption}
            onSsidChange={setSsid}
            onPasswordChange={setPassword}
            onIsHiddenChange={setIsHidden}
            onEncryptionChange={setEncryption}
          />

          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-corp-grey">
              {t("name")}
            </Text>
            <TextInput
              className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
              value={name}
              onChangeText={setName}
              placeholder={t("enterName")}
              placeholderTextColor="#767683"
            />
          </View>

          <TagInput
            tags={tags}
            newTag={newTag}
            onNewTagChange={setNewTag}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />

          <View className="mb-8">
            <Text className="mb-2 text-base font-medium text-corp-grey">
              {t("description")}
            </Text>
            <TextInput
              className="w-full rounded-lg border border-corp-mid-grey px-4 py-3 text-corp-grey"
              value={description}
              onChangeText={setDescription}
              placeholder={t("enterDescription")}
              placeholderTextColor="#767683"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View className="mb-8 flex-row">
            <Button
              title={t("cancel")}
              onPress={() => router.dismiss()}
              type="secondary"
              className="mr-2 flex-1 border border-corp-grey bg-white"
            />
            <Button
              title={isEditing ? t("update") : t("save")}
              onPress={handleSave}
              className="ml-2 flex-1 bg-corp-dark-teal"
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
