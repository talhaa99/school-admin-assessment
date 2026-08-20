const { Resend } = require("resend");
const { env } = require("../config");
const { ApiError } = require("./api-error");

const resend = new Resend(env.RESEND_API_KEY);
const EMAIL_SEND_TIMEOUT_MS = 5000;

const sendMail = async (mailOptions) => {
  if (!env.RESEND_API_KEY || /^re_123/.test(env.RESEND_API_KEY)) {
    throw new ApiError(500, "Unable to send email");
  }

  const sendPromise = resend.emails.send(mailOptions);
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new ApiError(500, "Unable to send email")), EMAIL_SEND_TIMEOUT_MS);
  });

  const { error } = await Promise.race([sendPromise, timeoutPromise]);
  if (error) {
    throw new ApiError(500, "Unable to send email");
  }
};

module.exports = {
  sendMail,
};
