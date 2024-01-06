// SignUp.js
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Divider } from "antd";
import {
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { message } from "antd";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase/setup";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Logo from "../reusable/logo";

export const SignUp = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onFinish = (values) => {
    const auth = getAuth();
    setLoading(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in

        setDoc(doc(db, "users", values.email), {
          email: values.email,
          status: "unpaid",
        })
          .then((docRef) => {
            // console.log("Document written with ID: ", docRef.id);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });

        navigate("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        // const errorMessage = error.message;
        if (errorCode === "auth/email-already-in-use") {
          message.error("Email already in use!");
        } else {
          message.error("Error occured!");
        }
        // console.log(errorCode);
        // console.log(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  const validatePassword = (rule, value) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(value)) {
      return Promise.reject(
        "Password must be at least 8 characters long with at least 1 special character and 1 number."
      );
    }
    return Promise.resolve();
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        marginTop: "50px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
        <Logo />
      </h1>
      <h1 style={{ textAlign: "center" }}>Sign Up</h1>
      <Divider />
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your Email!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your Password!" },
            { validator: validatePassword },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            suffix={
              <div
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </div>
            }
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ width: "100%" }}
            disabled={form.isSubmitting}
            loading={loading}
          >
            Sign Up
          </Button>
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            Or <a href="/login">login now!</a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
