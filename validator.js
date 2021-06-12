//============================= validation sign up form =============================

//Đối tượng Validator
function Validator(options) {
  const selectorRules = {};

  //Hàm thực hiện validate
  function validate(inputElement, rule) {
    const errorElement = inputElement.parentElement.querySelector(
      options.errorSelector
    );

    let errorMessage;
    //Lấy ra các rules của selector
    const rules = selectorRules[rule.selector];

    //lặp qua các rules và kiểm tra
    //nếu có lỗi thì dừng việc kiểm tra để tra về rule lỗi
    for (let i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) {
        break;
      }
    }

    if (errorMessage) {
      errorElement.innerHTML = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerHTML = "";
      inputElement.parentElement.classList.remove("invalid");
    }

    return !errorMessage;
  }

  //Lấy element của form cần validate
  const formElement = document.querySelector(options.form);

  if (formElement) {
    formElement.onsubmit = (e) => {
      e.preventDefault();

      let isFormValid = true;

      //thực hiện lặp qua từng rule và validate
      options.rules.forEach((rule) => {
        const inputElement = formElement.querySelector(rule.selector);
        const isValid = validate(inputElement, rule);

        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        //Trường hợp submit với javascript
        if (typeof options.onSubmit === "function") {
          const enableInputs = formElement.querySelectorAll("[name]");

          const formValues = Array.from(enableInputs).reduce(
            (values, input) => {
              return (values[input.name] = input.value) && values;
            },
            {}
          );

          options.onSubmit(formValues);
        }
        //Trường hợp submit với hành vi mặc định (html)
        else {
          formElement.submit();
        }
      }
    };

    //Xử lí lặp qua mỗi rule
    options.rules.forEach((rule) => {
      const inputElement = formElement.querySelector(rule.selector);

      //Lưu lại các rules cho mỗi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      //xử lí blur khỏi input
      if (inputElement) {
        inputElement.onblur = () => {
          validate(inputElement, rule);
        };
      }

      //xử lí khi người dùng nhập vào input
      inputElement.oninput = () => {
        const errorElement = inputElement.parentElement.querySelector(
          options.errorSelector
        );
        errorElement.innerHTML = "";
        inputElement.parentElement.classList.remove("invalid");
      };
    });
  }
}

//Định nghĩa rules
// nguyên tắc của các rules:
//1. Khi có lỗi  trả ra message lỗi
//2. Khi hợp lệ không trả ra gì (undefined)
Validator.isRequired = (selector, message) => {
  return {
    selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Can not be empty";
    },
  };
};

Validator.isEmail = (selector, message) => {
  return {
    selector,
    test: function (value) {
      const regex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      return regex.test(value) ? undefined : message || "This must be an email";
    },
  };
};

Validator.isPassword = function (selector, minLength, message) {
  return {
    selector,
    test: function (value) {
      return value >= minLength
        ? undefined
        : message || `Must least ${minLength} characters`;
    },
  };
};

Validator.isConfirmPassword = function (selector, getConfirmValue, message) {
  return {
    selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "This is invalid";
    },
  };
};

Validator({
  form: "#form-1",
  errorSelector: ".form-message",
  rules: [
    Validator.isRequired("#fullname"),
    Validator.isRequired("#email", "Can not be empty"),
    Validator.isEmail("#email"),
    Validator.isRequired("#password", "Can not be empty"),
    Validator.isPassword("#password", 6),
    Validator.isRequired("#confirmPassword", "Can not be empty"),
    Validator.isConfirmPassword(
      "#confirmPassword",
      () => {
        return document.querySelector("#form-1 #password").value;
      },
      "Confirm password is not match"
    ),
  ],
  // onSubmit: (data) => {
  //   console.log(data);
  // },
});
