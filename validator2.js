new Validator("#form-1");

function Validator(formSelector) {
  var _this = this;

  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  const formElement = document.querySelector(formSelector);
  const formRules = {};
  const validatorRules = {
    required: function (value) {
      return value ? undefined : "Can not be empty";
    },
    email: function (value) {
      const regex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return regex.test(value) ? undefined : "Enter your email";
    },
    min: function (min) {
      return function (value) {
        return value.length >= min ? undefined : `Must least ${min} characters`;
      };
    },
  };

  if (formElement) {
    const inputs = formElement.querySelectorAll("[name][rules]");

    for (const input of inputs) {
      const rules = input.getAttribute("rules").split("|");

      for (var rule of rules) {
        //Rule cần value (rule min cần value)
        var ruleInfo;
        const isRuleHasValue = rule.includes(":");

        if (isRuleHasValue) {
          ruleInfo = rule.split(":");
          rule = ruleInfo[0];
        }

        var ruleFunc = validatorRules[rule];

        //Nếu là rule cần value thì lấy function bên trong
        if (isRuleHasValue) {
          ruleFunc = ruleFunc(ruleInfo[1]);
        }

        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc);
        } else {
          formRules[input.name] = [ruleFunc];
        }
      }

      //Lắng nghe events trên thằng input để validate (blur, change,...)
      input.onblur = handleValidate;
      input.oninput = handleClearError;
    }

    //Hàm thực thi validate
    function handleValidate(e) {
      const rules = formRules[e.target.name];
      var errorMessage;

      for (const rule of rules) {
        errorMessage = rule(e.target.value);
        if (errorMessage) break;
      }

      //nếu có lỗi thì hiển thị lỗi
      if (errorMessage) {
        const formGroup = getParent(e.target, ".form-group");

        if (formGroup) {
          var formMessage = formGroup.querySelector(".form-message");

          formGroup.classList.add("invalid");
          if (formMessage) {
            formMessage.innerText = errorMessage;
          }
        }
      }
      return !errorMessage;
    }

    //Hàm clear message lỗi
    function handleClearError(e) {
      const formGroup = getParent(e.target, ".form-group");

      if (formGroup.classList.contains("invalid")) {
        var formMessage = formGroup.querySelector(".form-message");

        formGroup.classList.remove("invalid");
        if (formMessage) {
          formMessage.innerText = "";
        }
      }
    }
  }

  //Xử lí hành vi submit
  formElement.onsubmit = function (e) {
    e.preventDefault();

    const inputs = formElement.querySelectorAll("[name][rules]");
    var isValid = true;

    for (const input of inputs) {
      if (
        !handleValidate({
          target: input,
        })
      ) {
        isValid = false;
      }
    }

    //Khi không có lỗi thì submit form và ngược lại
    if (isValid) {
      if (typeof _this.onsubmit === "function") {
        const enableInputs = formElement.querySelectorAll("[name]");
        const formValues = Array.from(enableInputs).reduce((values, input) => {
          switch (input.type) {
            case "radio":
              values[input.name] = formElement.querySelector(
                "input[name='" + input.name + "']:checked"
              ).value;
              break;
            case "checkbox":
              if (!Array.isArray(values[input.name])) {
                values[input.name] = [];
              }
              if (!input.matches(":checked")) {
                return values;
              }
              values[input.name].push(input.value);
              break;
            case "file":
              values[input.name] = input.files;
              break;
            default:
              values[input.name] = input.value;
          }
          return values;
        }, {});

        //GỌi lại hàm onsubmit và trả về giá trị của form
        _this.onsubmit(formValues);
      } else {
        formElement.submit();
      }
    }
  };
}
