import React, { useState } from "react";
import { ChevronDown, X, Minus } from "lucide-react";
import authService from "@/service/auth.service";

// Input Field Component
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  showDropdown = false,
}) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">
      {label}
      <span className="text-red-500 ml-1">*</span>
    </label>
    <div className="relative flex items-center">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-2 border rounded ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {showDropdown && (
        <div className="absolute right-2 pointer-events-none">
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Header Component
const Header = () => (
  <div className="flex justify-between items-center bg-blue-500 p-2">
    <div className="flex items-center">
      <img src="/rc_logo_small.png" alt="RiceCall" className="h-5 mr-2" />
      <img src="/login_logo_title.png" alt="RiceCall" className="h-3" />
    </div>
    <div className="flex items-center">
      <button className="text-white hover:bg-blue-600 p-1">
        <Minus size={16} />
      </button>
      <button className="text-white hover:bg-blue-600 p-1 ml-1">
        <X size={16} />
      </button>
    </div>
  </div>
);

// Login Form Component
const LoginForm = React.memo(({ form, errors, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="w-full max-w-sm">
    {errors.general && (
      <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
        {errors.general}
      </div>
    )}

    <InputField
      label="帳號"
      name="account"
      value={form.account}
      onChange={onChange}
      placeholder="請輸入帳號"
      error={errors.account}
      showDropdown
    />

    <InputField
      label="密碼"
      name="password"
      type="password"
      value={form.password}
      onChange={onChange}
      placeholder="請輸入密碼"
      error={errors.password}
    />

    <div className="flex justify-between mb-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          name="rememberAccount"
          checked={form.rememberAccount}
          onChange={onChange}
          className="mr-2"
        />
        <span className="text-sm">記住帳號</span>
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          name="autoLogin"
          checked={form.autoLogin}
          onChange={onChange}
          className="mr-2"
        />
        <span className="text-sm">自動登入</span>
      </label>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
    >
      登入
    </button>
  </form>
));

// Register Form Component
const RegisterForm = React.memo(({ form, errors, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="w-full max-w-sm">
    {errors.general && (
      <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
        {errors.general}
      </div>
    )}

    <InputField
      label="帳號"
      name="account"
      value={form.account}
      onChange={onChange}
      placeholder="請輸入帳號"
      error={errors.account}
    />

    <InputField
      label="密碼"
      name="password"
      type="password"
      value={form.password}
      onChange={onChange}
      placeholder="請輸入密碼"
      error={errors.password}
    />

    <InputField
      label="顯示名稱"
      name="username"
      value={form.username}
      onChange={onChange}
      placeholder="請輸入顯示名稱"
      error={errors.username}
    />

    {/* Gender Selection */}
    <div className="mb-4">
      <label className="block text-sm mb-1">
        性別
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="relative flex items-center">
        <select
          name="gender"
          value={form.gender}
          onChange={onChange}
          className="w-full p-2 border rounded border-gray-300"
        >
          <option value="Male">男性</option>
          <option value="Female">女性</option>
        </select>
      </div>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
    >
      註冊
    </button>
  </form>
));

// Validation functions
const validateAccount = (value) => {
  value = value.trim();
  if (!value) return "帳號為必填";
  if (value.length < 4) return "帳號至少需要 4 個字";
  if (value.length > 16) return "帳號最多 16 個字";
  if (!/^[A-Za-z0-9_\.]+$/.test(value))
    return "帳號只能使用英文、數字、底線(_)和點(.)";
  return "";
};

const validatePassword = (value) => {
  value = value.trim();
  if (!value) return "密碼為必填";
  if (value.length < 8) return "密碼至少需要 8 個字";
  if (value.length > 20) return "密碼最多 20 個字";
  if (!/^[A-Za-z0-9@$!%*#?&]{8,20}$/.test(value))
    return "密碼長度需要在8-20個字之間，且不包含@$!%*#?&以外的特殊字元";
  return "";
};

const validateUsername = (value) => {
  value = value.trim();
  if (!value) return "顯示名稱為必填";
  if (value.length < 1) return "顯示名稱至少需要 1 個字";
  if (value.length > 32) return "顯示名稱最多 32 個字";
  return "";
};

// Main Auth Page Component
const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  const [loginForm, setLoginForm] = useState({
    account: "",
    password: "",
    rememberAccount: false,
    autoLogin: false,
  });

  const [registerForm, setRegisterForm] = useState({
    account: "",
    password: "",
    username: "",
    gender: "Male",
  });

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "account") {
      setLoginErrors((prev) => ({
        ...prev,
        account: validateAccount(value),
      }));
    } else if (name === "password") {
      setLoginErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "account") {
      setRegisterErrors((prev) => ({
        ...prev,
        account: validateAccount(value),
      }));
    } else if (name === "password") {
      setRegisterErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    } else if (name === "username") {
      setRegisterErrors((prev) => ({
        ...prev,
        username: validateUsername(value),
      }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const accountError = validateAccount(loginForm.account);
    const passwordError = validatePassword(loginForm.password);

    setLoginErrors({
      account: accountError,
      password: passwordError,
    });

    if (!accountError && !passwordError) {
      try {
        const data = await authService.login(loginForm);
        onLoginSuccess(data.user);
      } catch (error) {
        setLoginErrors({
          general: error.message,
        });
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Validate using original password
    const accountError = validateAccount(registerForm.account);
    const passwordError = validatePassword(registerForm.password);
    const usernameError = validateUsername(registerForm.username);

    setRegisterErrors({
      account: accountError,
      password: passwordError,
      username: usernameError,
    });

    if (!accountError && !passwordError && !usernameError) {
      try {
        await authService.register(registerForm);
        setIsLogin(true);
      } catch (error) {
        setRegisterErrors({
          general: error.message,
        });
      }
    }
  };

  return (
    <div className="h-screen bg-white select-none">
      <Header />
      <div className="flex flex-col items-center pt-10 px-8">
        <img src="/login_logo.png" alt="RiceCall Logo" className="mb-8" />

        {isLogin ? (
          <LoginForm
            form={loginForm}
            errors={loginErrors}
            onChange={handleLoginChange}
            onSubmit={handleLoginSubmit}
          />
        ) : (
          <RegisterForm
            form={registerForm}
            errors={registerErrors}
            onChange={handleRegisterChange}
            onSubmit={handleRegisterSubmit}
          />
        )}

        <div className="flex justify-between w-full max-w-sm mt-4">
          <button
            className="text-sm text-gray-600 hover:text-blue-500"
            onClick={() => {
              setIsLogin(!isLogin);
              setLoginErrors({});
              setRegisterErrors({});
            }}
          >
            {isLogin ? "註冊帳號" : "返回登入"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
