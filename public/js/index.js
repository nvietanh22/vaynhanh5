let btnSubmit = document.getElementById("btn-submit");
let btnSubmitMobile = document.getElementById("btn-submit-mobile");
const OTP_VERIFY_MESSAGE = 'OTP không chính xác. Quý khách vui lòng kiểm tra lại!';

let btnSubmitPopup = document.getElementById("btn-submit-popup");
let btnChangePhone = document.getElementById("btn-change-phone");
let isOtpFailed = false;
var myModal = new bootstrap.Modal(document.getElementById("myModal"));
var modalForm = new bootstrap.Modal(document.getElementById("modalForm"));
var modalNoti = new bootstrap.Modal(document.getElementById("modalNoti"));
var modalNotiDefault = new bootstrap.Modal(document.getElementById("modalNotiDefault"));
var modalPolicy = new bootstrap.Modal(document.getElementById("modalPolicy"));

const countdownElement = document.getElementById("countdown");
let countdownInterval;

function hideBackpop() {
    $('#style_popup').remove();
}

btnSubmit.addEventListener("click", () => {
    clearInterval(countdownInterval);
    let formId = '#form-submit';
    let formData = $(formId).getValue();
    let rsValidate = this.validate(formData);
    if (!rsValidate.valid) {
        const formattedMsg = rsValidate.msg.replace(/, /g, ',\n').replace(/\. /g, '.\n');
        showNotiDefault('error', 'Thất bại', formattedMsg);
        return;
    }
    if (!formData.i_agree_terms_and_conditions) {
        showNotiDefault('error', 'Thất bại', 'Quý khách vui lòng đồng ý với chính sách & điều khoản dịch vụ!');
        return;
    }
    sendWarehouseProcessRequest(formId);
    genOtp(formId)
    startCountdown();
});

$('#btn-header-regist').click(function (event) {
    event.preventDefault()
    modalForm.show();
});
$('#btn-header-regist-mobile').click(function (event) {
    event.preventDefault()
    modalForm.show();
});

$('.btn-card_regist').click(function (event) {
    event.preventDefault()
    modalForm.show();
});

$('.btn-card_regist-loan-product').click(function (event) {
    event.preventDefault()
    modalForm.show();
});
$('.btn-card_regist-loan-product-mobile').click(function (event) {
    event.preventDefault()
    modalForm.show();
});
$('.btn-card_regist-mobile').click(function (event) {
    event.preventDefault()
    modalForm.show();
});
$('#btn-lotte_premium').on('click', function (event) {
    event.preventDefault()
    modalForm.show();
});

$('#btn-lotte_standard').on('click', function (event) {
    event.preventDefault()
    modalForm.show();
});

$('#btn-lotte_young').on('click', function (event) {
    event.preventDefault()
    modalForm.show();
});

$('#btn-regist').on('click', function (event) {
    event.preventDefault()
    modalForm.show();
});


$('#btn-close-noti').click(() => {
    let classArr = $('#noti-icon-error').attr('class');
    if (classArr.indexOf('d-none') <= 0) {
        if (isOtpFailed) {
            myModal.show()
        } else {
            modalForm.show();
        }
    }
    modalNoti.hide();
})

$('#btn-close-noti-default').click(() => {
    if (isOtpFailed) {
        myModal.show()
    }
    modalNotiDefault.hide();
})

$('#policy-info').click(() => {
    modalForm.hide();
    modalPolicy.show()
})


btnSubmitPopup.addEventListener("click", (event) => {
    event.preventDefault()
    clearInterval(countdownInterval);
    modalForm.hide();
    let formId = '#form-submit-popup';
    let formData = $(formId).getValue();
    let rsValidate = this.validate(formData);
    if (!rsValidate.valid) {
        const formattedMsg = rsValidate.msg.replace(/, /g, ',\n').replace(/\. /g, '.\n');
        showNotiDefault('error', 'Thất bại', formattedMsg);
        return;
    }
    if (!formData.i_agree_terms_and_conditions) {
        showNoti('error', 'Thất bại', 'Quý khách vui lòng đồng ý với chính sách & điều khoản dịch vụ!');
        return;
    }
    sendWarehouseProcessRequest(formId);
    genOtp(formId)
    startCountdown();
});

btnSubmitMobile.addEventListener("click", (event) => {
    clearInterval(countdownInterval);
    let formId = '#form-submit-mobile';
    let formData = $(formId).getValue();
    let rsValidate = this.validate(formData);
    if (!rsValidate.valid) {
        const formattedMsg = rsValidate.msg.replace(/, /g, ',\n').replace(/\. /g, '.\n');
        showNotiDefault('error', 'Thất bại', formattedMsg);
        return;
    }
    if (!formData.i_agree_terms_and_conditions) {
        showNotiDefault('error', 'Thất bại', 'Quý khách vui lòng đồng ý với chính sách & điều khoản dịch vụ!');
        return;
    }
    sendWarehouseProcessRequest(formId);
    genOtp(formId)
    startCountdown();
});

async function genOtp(prevForm) {
    isOtpFailed = false;
    hideBackpop();
    // grecaptcha.ready(function () {
    //     grecaptcha
    //         .execute("GOOGLE_SITE_KEY_TEMP", {action: "submit"})
    //         .then(function (token) {
                $('#loading').show();
                let validateUrl = `http://localhost:8080/api/lead/validate`;
                let formData = $(prevForm).getValue();
                let dataValidate = {
                    request_id: uuidv4(),
                    contact_number: formData.phone,
                }
                debugger
                lib.post({
                    url: validateUrl,
                    // token: token,
                    data: JSON.stringify(dataValidate),
                    complete: function (response) {
                        $('#loading').hide();
                        let dataRes = response.responseJSON;
                        if (dataRes.rslt_cd === 's' && dataRes.reason_code === '0') {
                            // grecaptcha.ready(function () {
                            //     grecaptcha
                            //         .execute("GOOGLE_SITE_KEY_TEMP", {action: "submit"})
                            //         .then(function (token) {
                                        $('#loading').show();
                                        let urlOtp = `http://localhost:8080/api/otp/gen-otp`;
                                        let formData = $(prevForm).getValue();
                                        let dataOtp = {
                                            TransId: uuidv4(),
                                            Data: {
                                                phone: formData.phone,
                                                idCard: formData.idCard
                                            }
                                        }

                                        lib.post({
                                            url: urlOtp,
                                            // token: token,
                                            data: JSON.stringify(dataOtp),
                                            complete: function (response) {
                                                console.log('Response otp', response)
                                                let dataRes = response.responseJSON;
                                                if (dataRes.data.result.status && dataRes.data.result.value) {
                                                    myModal.toggle();
                                                    $('#prev-form').val(prevForm);
                                                } else if (!dataRes.data.result.status) {
                                                    if (prevForm == '#form-submit' || prevForm == '#FORM_TEXT25' || prevForm == '#form-submit-mobile') {
                                                        showNotiDefault('error', 'Thất bại', dataRes.errorMessage);
                                                    } else {
                                                        showNoti('error', 'Thất bại', dataRes.errorMessage);
                                                    }
                                                } else if (dataRes.data.result.status && !dataRes.data.result.value) {
                                                    if (prevForm == '#form-submit' || prevForm == '#FORM_TEXT25' || prevForm == '#form-submit-mobile') {
                                                        showNotiDefault('error', 'Thất bại', 'Tạo Mã OTP không thành công, Vui lòng thử lại sau');
                                                    } else {
                                                        showNoti('error', 'Thất bại', 'Tạo Mã OTP không thành công, Vui lòng thử lại sau');
                                                    }
                                                } else {
                                                    if (prevForm == '#form-submit' || prevForm == '#FORM_TEXT25' || prevForm == '#form-submit-mobile') {
                                                        showNotiDefault('error', 'Thất bại', dataRes.errorMessage);
                                                    } else {
                                                        showNoti('error', 'Thất bại', dataRes.errorMessage);
                                                    }
                                                }
                                                $('#loading').hide();
                                            },
                                            error: function (ex) {
                                                if (prevForm == '#form-submit' || prevForm == '#FORM_TEXT25' || prevForm == '#form-submit-mobile') {
                                                    showNotiDefault('error', 'Thất bại', ex.responseJSON ? ex.responseJSON.errorMessage : 'Đăng ký chưa thành công11111111, vui lòng kiểm tra lại thông tin');
                                                } else {
                                                    showNoti('error', 'Thất bại', ex.responseJSON ? ex.responseJSON.errorMessage : 'Đăng ký chưa thành công2222222, vui lòng kiểm tra lại thông tin');
                                                }

                                                $('#loading').hide();
                                            },
                                        });
                                    // });
                            // });
                        } else {
                            if (prevForm == '#form-submit' || prevForm == '#FORM_TEXT25' || prevForm == '#form-submit-mobile') {
                                showNotiDefault('error', 'Thất bại', 'Số điện thoại của Quý khách đã có trong hệ thống của chúng tôi, Vui lòng gọi Hotline 1900 633 070 để được hỗ trợ!');

                            } else {
                                showNoti('error', 'Thất bại', 'Số điện thoại của Quý khách đã có trong hệ thống của chúng tôi, Vui lòng gọi Hotline 1900 633 070 để được hỗ trợ!');
                            }
                        }
                        $('#loading').hide();
                    },
                    error: function (ex) {
                        if (prevForm == '#form-submit' || prevForm == '#FORM_TEXT25' || prevForm == '#form-submit-mobile') {
                            showNotiDefault('error', 'Thất bại', ex.responseJSON && ex.responseJSON.rslt_cd == 'f' ? 'Số điện thoại của Quý khách đã có trong hệ thống của chúng tôi, Vui lòng gọi Hotline 1900 633 070 để được hỗ trợ!'
                                : 'Đăng ký chưa thành công333333, vui lòng kiểm tra lại thông tin!');
                        } else {
                            showNoti('error', 'Thất bại', ex.responseJSON && ex.responseJSON.rslt_cd == 'f' ? 'Số điện thoại của Quý khách đã có trong hệ thống của chúng tôi, Vui lòng gọi Hotline 1900 633 070 để được hỗ trợ!'
                                : 'Đăng ký chưa thành công444444, vui lòng kiểm tra lại thông tin!');
                        }
                        $('#loading').hide();
                    },
                });
            // })
    // });
}

function verifyOtp(otpDegit) {
    grecaptcha.ready(function () {
        grecaptcha
            .execute("GOOGLE_SITE_KEY_TEMP", {action: "submit"})
            .then(function (token) {
                $('#loading').show();
                let urlOtp = `${env.backEndApi}/api/otp/verify-otp`;
                let formId = $('#prev-form').val();
                let formData = $(formId).getValue();

                let otpCode = `${otpDegit.code01}${otpDegit.code02}${otpDegit.code03}${otpDegit.code04}${otpDegit.code05}${otpDegit.code06}`;
                let dataOtp = {
                    TransId: uuidv4(),
                    Data: {
                        phone: formData.phone,
                        otp: otpCode
                    }
                }
                lib.post({
                    token: token,
                    url: urlOtp,
                    data: JSON.stringify(dataOtp),
                    complete: function (response) {
                        let dataRes = response.responseJSON;
                        if (dataRes.data.result.status && dataRes.data.result.value && dataRes.data.result.authentication === 'ACCEPT') {
                            grecaptcha.ready(function () {
                                isOtpFailed = false;
                                grecaptcha
                                    .execute("GOOGLE_SITE_KEY_TEMP", {action: "submit"})
                                    .then(function (token) {
                                        $('#prev-form').val('');
                                        var navigator_info = window.navigator;
                                        var screen_info = window.screen;
                                        var deviceId = navigator_info.mimeTypes.length;
                                        deviceId += navigator_info.userAgent.replace(/\D+/g, "");
                                        deviceId += navigator_info.plugins.length;
                                        deviceId += screen_info.height || "";
                                        deviceId += screen_info.width || "";
                                        deviceId += screen_info.pixelDepth || "";

                                        var urlSearchParams = new URLSearchParams(window.location.search);
                                        var submitdata = urlSearchParams.get('utm_source');
                                        var utmMedium = urlSearchParams.get('utm_medium');
                                        var utmCampaign = urlSearchParams.get('utm_campaign');
                                        var utmContent = urlSearchParams.get('utm_content');

                                        var gclid = urlSearchParams.get('gclid');
                                        var fbclid = urlSearchParams.get('fbclid');
                                        var ttclid = urlSearchParams.get('ttclid');
                                        var clickId = '';
                                        if (gclid) {
                                            clickId = gclid;
                                        } else if (fbclid) {
                                            clickId = fbclid;
                                        } else if (ttclid) {
                                            clickId = ttclid;
                                        }

                                        var dataNote = {
                                            cmnd: formData.idCard,
                                            province: formData.livingPlace,
                                            score: utmMedium,
                                            isdn: utmCampaign,
                                            income_amount: null,
                                            email: null,
                                            gender: null,
                                            submitdata: submitdata,
                                            oldloan: utmContent,
                                            income: null,
                                            company: clickId,
                                            obt: "OTP thành công",
                                            personalData: "Đồng ý để LFVN sử dụng DLCN cho mục đích quảng cáo, truyền thông"
                                        };

                                        let data = {
                                            request_id: uuidv4(),
                                            device: "01",
                                            fullname: formData.name,
                                            birthday: null,
                                            contact_number: formData.phone,
                                            note: JSON.stringify(dataNote),
                                        };
                                        const timeCallValue = formData.timeCall1 ? formData.timeCall1 : formData.timeCall2;

                                        let url = `${env.backEndApi}/api/lead/send`;
                                        lib.post({
                                            token: token,
                                            url: url,
                                            data: JSON.stringify(data),
                                            complete: function (response) {
                                                $('#loading').hide();
                                                sendWarehouseProcessRequest(formId, "Thành công");
                                                showNoti('success', 'Thành công', 'Cảm ơn Quý khách đã đăng ký thông tin. Chúng tôi sẽ liên hệ lại sớm nhất!');
                                                hideModal();

                                            },
                                            error: function (ex) {
                                                $('#loading').hide();
                                                if (formId == '#form-submit' || formId == '#FORM_TEXT25' || prevForm == '#form-submit-mobile') {
                                                    showNotiDefault('error', 'Thất bại', 'Đăng ký chưa thành công, vui lòng kiểm tra lại thông tin');
                                                } else {
                                                    showNoti('error', 'Thất bại', 'Đăng ký chưa thành công, vui lòng kiểm tra lại thông tin');
                                                }
                                                hideModal();
                                            },
                                        });
                                    });
                            });
                        } else {
                            isOtpFailed = true;
                            $('#loading').hide();

                            if (formId == '#form-submit' || formId == '#FORM_TEXT25' || prevForm == '#form-submit-mobile') {
                                if (!dataRes.data.result.status) {
                                    showNotiDefault('error', 'Thất bại', 'OTP của Quý khách nhập chưa đúng hoặc đã hết thời hạn sử dụng, vui lòng đăng ký lại!');
                                } else if (!dataRes.data.result.value) {
                                    showNotiDefault('error', 'Thất bại', 'OTP của Quý khách nhập chưa đúng hoặc đã hết thời hạn sử dụng, vui lòng đăng ký lại!');
                                } else {
                                    showNotiDefault('error', 'Thất bại', dataRes.errorMessage);
                                }
                            } else {
                                isOtpFailed = true;
                                if (!dataRes.data.result.status) {
                                    showNoti('error', 'Thất bại', 'OTP của Quý khách nhập chưa đúng hoặc đã hết thời hạn sử dụng, vui lòng đăng ký lại!');
                                } else if (!dataRes.data.result.value) {
                                    showNoti('error', 'Thất bại', 'OTP của Quý khách nhập chưa đúng hoặc đã hết thời hạn sử dụng, vui lòng đăng ký lại!');
                                } else {
                                    showNoti('error', 'Thất bại', dataRes.errorMessage);
                                }
                            }
                        }
                    },
                    error: function (ex) {
                        $('#loading').hide();
                        if (formId == '#form-submit' || formId == '#FORM_TEXT25' || prevForm == '#form-submit-mobile') {
                            showNotiDefault('error', 'Thất bại', ex.responseJSON ? ex.responseJSON.errorMessage : 'Xác thực OTP chưa thành công, Quý khách vui lòng thử lại!');
                        } else {
                            showNoti('error', 'Thất bại', ex.responseJSON ? ex.responseJSON.errorMessage : 'Xác thực OTP chưa thành công, Quý khách vui lòng thử lại!');
                        }
                    },
                });
            })
    });
}

function sendWarehouseProcessRequest(prevForm, otpStatus = "Thất bại") {
    grecaptcha.ready(function () {
        grecaptcha
            .execute("GOOGLE_SITE_KEY_TEMP", {action: "submit"})
            .then(function (token) {
                $('#loading').show();
                let formData = $(prevForm).getValue();
                console.log("start request")
                const requestData = {
                    custName: formData.name,
                    idCard: formData.idCard,
                    phoneNumber: formData.phone,
                    custAddress: "",
                    salaryType: "",
                    timeCall: "",
                    otpStatus: otpStatus,
                    cicStatus: "",
                    obtStatus: "",
                    metadata: "",
                    createdDate: ""
                };
                let url = `http://localhost:8080/api/warehouse/process`;
                lib.post({
                    url: url,
                    // token: token,
                    data: JSON.stringify(requestData),
                    complete: function (response) {
                        $('#loading').hide();
                    },
                    error: function (error) {
                        $('#loading').hide();
                        showNoti('error', 'Thất bại', error.responseJSON?.message || 'Không thể gửi yêu cầu đến server!');
                    }
                });
                // })
                // });
                console.log("Done")
            })
    });
}

    btnChangePhone.addEventListener("click", () => {
        hideModal();
    });

    function uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
            (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16)
        );
    }

    function hideModal() {
        clearInterval(countdownInterval);
        myModal.hide();
    }

    function validate(formData) {
        let rs = {
            valid: true,
            msg: "",
        };

        let message = "";
        let comma = "";
        if (!formData.idCard) {
            rs.valid = false;
            message += `${comma} Số CCCD là bắt buộc`;
            comma = ', ';
        } else if (!lib.validateIdCard(formData.idCard)) {
            rs.valid = false;
            message += `${comma} Số CCCD không đúng định dạng`;
            comma = ', ';
        } else if (!lib.validateIdCardToRegister(formData.idCard).isValid) {
            rs.valid = false;
            message += `${comma} Độ tuổi theo số CCCD của Quý khách không nằm trong độ tuổi được cung cấp khoản vay của LOTTE Finance`;
            comma = ', ';
        }

        if (!formData.name) {
            rs.valid = false;
            message += `${comma} Họ và Tên là bắt buộc`;
            comma = ', ';
        }

        if (!formData.phone) {
            rs.valid = false;
            message += `${comma} Số điện thoại là bắt buộc`;
            comma = ', ';
        } else if (!lib.validatePhoneNumber(formData.phone)) {
            rs.valid = false;
            message += `${comma} Số điện thoại không đúng định dạng`;
            comma = ', ';
        }
        if (message != '') {
            message += '. Quý khách vui lòng kiểm tra lại thông tin';
        }
        rs.msg = message;
        return rs;
    }

// === OTP
    $('.otp-input').on('input', function () {
        let regexNum = /^\d+$/;
        let valueOtp = $(this).val();
        if (!regexNum.test(valueOtp)) {
            $(this).val(null)
            return;
        }
        if (valueOtp < 0) {
            $(this).val(null)
            return;
        }

        if (valueOtp > 9) {
            $(this).val(null)
            return;
        }
        // Move to the next input field when a digit is entered
        var maxLength = parseInt($(this).attr('maxlength'));
        var currentLength = $(this).val().length;

        if (currentLength >= maxLength) {
            // Find the next input field
            var index = $('.otp-input').index(this);
            var nextInput = $('.otp-input').eq(index + 1);

            // Focus on the next input field
            if (nextInput.length) {
                nextInput.focus();
            }
        }
        let code01 = $('#otp-01').val();
        let code02 = $('#otp-02').val();
        let code03 = $('#otp-03').val();
        let code04 = $('#otp-04').val();
        let code05 = $('#otp-05').val();
        let code06 = $('#otp-06').val();

        if (code01 && code02 && code03 && code04 && code05 && code06) {
            let otpDegit = {
                code01: code01,
                code02: code02,
                code03: code03,
                code04: code04,
                code05: code05,
                code06: code06
            }
            verifyOtp(otpDegit);
        }
    });

    $("#myModal").on("hidden.bs.modal", function () {
        $('#otp-01').val(null);
        $('#otp-02').val(null);
        $('#otp-03').val(null);
        $('#otp-04').val(null);
        $('#otp-05').val(null);
        $('#otp-06').val(null);
        $('#otp-01').focus();
    });

    function startCountdown() {
        const countdownTimeInMinutes = 5;
        const endTime = new Date().getTime() + countdownTimeInMinutes * 60 * 1000;

        function updateCountdown() {
            const currentTime = new Date().getTime();
            const timeDifference = endTime - currentTime;

            if (timeDifference > 0) {
                const minutes = Math.floor(
                    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                if (seconds < 10) {
                    countdownElement.innerHTML = `${minutes}:0${seconds}`;
                } else {
                    countdownElement.innerHTML = `${minutes}:${seconds}`;
                }
            } else {
                clearInterval(countdownInterval);
                countdownElement.innerHTML = "Hết hạn nhập thông tin OTP!";
                myModal.hide();
            }
        }

        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);

    }


    function changeStyleDropdown(arr) {
        arr.forEach(item => {
            $(`#${item.id}`).removeAttr('style')
            $(`#${item.id}`).css(item.style)
        })
    }

    function showNoti(type, title, message) {
        modalNoti.show();
        // myModal.hide();
        $('#noti-title').text(title);
        if (type == 'success') {
            $('#noti-icon-error').addClass('d-none');
            $('#noti-icon-success').removeClass('d-none');
            $('#btn-close-noti').text('Đóng');
            if ($("#lead-submit-success").length === 0) {
                $("#lead-result").append("<p id='lead-submit-success'></p>");
            }
        } else {
            $('#noti-icon-success').addClass('d-none');
            $('#noti-icon-error').removeClass('d-none');
            $('#btn-close-noti').text('Quay lại');
            $('#lead-result #lead-submit-success').remove();
        }
        $('#noti-message').text(message)
    }

    function showNotiDefault(type, title, message) {
        modalNotiDefault.show();
        // myModal.hide();
        $('#noti-title-default').text(title);
        if (type == 'success') {
            $('#noti-icon-error-default').addClass('d-none');
            $('#noti-icon-success-default').removeClass('d-none');
            $('#btn-close-noti-default').text('Đóng');
            if ($("#lead-submit-success").length === 0) {
                $("#lead-result").append("<p id='lead-submit-success'></p>");
            }
        } else {
            $('#noti-icon-success-default').addClass('d-none');
            $('#noti-icon-error-default').removeClass('d-none');
            $('#btn-close-noti-default').text('Quay lại');
            $('#lead-result #lead-submit-success').remove();
        }
        $('#noti-message-default').text(message)
    }

    $("#livingPlace").change(function () {
        if ($(this).val() == "") $(this).addClass("empty");
        else $(this).removeClass("empty")
    });

    $("#livingPlace").change();

    $("#documentType").change(function () {
        if ($(this).val() == "") $(this).addClass("empty");
        else $(this).removeClass("empty")
    });

    $("#documentType").change();


    $('#formWebTimeCall1').click(() => {
        $('#call-1').show();
        $('#call-2').hide();
        $('select[name="timeCall1"]').prop('disabled', false)
        $('select[name="timeCall2"]').val(null);
        if (!$('#call-2').hasClass('d-none')) {
            $('#call-2').addClass('d-none')
        }

    });


    $('#formWebTimeCall2').click(() => {
        $('#call-1').hide();
        $('#call-2').show();
        $('select[name="timeCall2"]').prop('disabled', false)
        $('select[name="timeCall1"]').val(null);
        if ($('#call-2').hasClass('d-none')) {
            $('#call-2').removeClass('d-none')
        }
    })

    $('#formModalTimeCall1').click(() => {
        $('#call-mobile-1').show();
        $('#call-mobile-2').hide();
        $('select[name="timeCall1"]').prop('disabled', false)
        $('select[name="timeCall2"]').val(null);
        if (!$('#call-mobile-2').hasClass('d-none')) {
            $('#call-mobile-2').addClass('d-none')
        }

    });


    $('#formModalTimeCall2').click(() => {
        $('#call-mobile-1').hide();
        $('#call-mobile-2').show();
        $('select[name="timeCall2"]').prop('disabled', false)
        $('select[name="timeCall1"]').val(null);
        if ($('#call-mobile-2').hasClass('d-none')) {
            $('#call-mobile-2').removeClass('d-none')
        }
    })

    const rangeInput = document.getElementById('amount-rate');
    const resultSpan = document.getElementById('amount-rate-result');
    const amountTotal = document.getElementById('amount-total');
    const monthRangeInput = document.getElementById('month-rate');
    const monthResult = document.getElementById('month-rate-result');

// Function to format the number as VND with commas
    function formatVND(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

// Listen for the input event on the range slider
    rangeInput.addEventListener('input', function () {
        // Update the text content of the result span with the formatted value
        resultSpan.textContent = formatVND(rangeInput.value);
        amountTotal.textContent = `${formatVND(Math.round(calculatePMT(0.18 / 12, Number(monthRangeInput.value), Number(rangeInput.value)) / 1000) * 1000)} VND`;

    });


    monthRangeInput.addEventListener('input', function () {
        // Update the text content of the result span with the formatted value
        monthResult.textContent = monthRangeInput.value;
        amountTotal.textContent = `${formatVND(Math.round(calculatePMT(0.18 / 12, Number(monthRangeInput.value), Number(rangeInput.value)) / 1000) * 1000)} VND`;

    });


    function calculatePMT(rate, nper, pv, fv = 0, type = 0) {
        if (rate === 0) {
            return -(pv + fv) / nper;
        }

        const pvif = Math.pow(1 + rate, nper);
        let pmt = (rate * pv * (pvif + fv)) / (pvif - 1);

        if (type === 1) {
            pmt /= 1 + rate;
        }

        return pmt.toFixed();
    }


// Select all carousel elements
    const carousels = document.querySelectorAll('.carousel');

// Loop through each carousel element
    carousels.forEach(carouselElement => {
        const carousel = new bootstrap.Carousel(carouselElement, {
            interval: 2000, // Adjust your interval timing here
            ride: false // Disable automatic riding on page load to control it manually
        });

        // Create the IntersectionObserver for each carousel
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // If the carousel is in the viewport, resume autoplay
                    carousel.cycle();
                } else {
                    // If the carousel is out of the viewport, pause autoplay
                    carousel.pause();
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of the carousel is in the viewport
        });

        // Observe the current carousel element
        observer.observe(carouselElement);
    });





