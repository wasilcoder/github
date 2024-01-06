// SignIn.js
import { useState } from "react";
import { Form, Input, Button, Checkbox, message, Spin, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Logo from "../reusable/logo";
// import { useAuth } from "../context/AuthProvider";

export const SignIn = () => {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [signing, setsigning] = useState(false);
  const navigate = useNavigate();
  // const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onFinish = (values) => {
    setsigning(true);
    console.log("Received values:", values);
    setLoading(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, values.username, values.password)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;
        console.log("Sign-in successful:", values);
        navigate("/login");

        // Show success message
        message.success("Sign-in successful!");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        // const errorMessage = error.message;
        // const errorMessage = error.message;
        if (errorCode === "auth/invalid-login-credentials") {
          message.error("Invalid email or password!");
        } else {
          message.error("Error occured!");
        }
        console.log(errorCode);
      })
      .finally(() => {
        setsigning(false);
      });
    setLoading(false);
    // Add your sign-in logic here, e.g., make an API call to authenticate the user
    // For now, let's just log the form values
  };

  return (
    <>
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
        <h2 style={{ textAlign: "center", marginBottom: 40 }}>
          <Logo />
        </h2>
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>Sign In</h1>
        <Divider />
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
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
                  {showPassword ? "Hide" : "Show"}
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
              loading={signing}
            >
              Sign In
            </Button>
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              Or <a href="/signup">Sign Up Now!</a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
