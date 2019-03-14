const SMTPClient = require('nodemailer/lib/smtp-connection');
const Mustache = require('mustache');
const fs = require('fs');
const mjml = require('mjml');

const sendEmail = (receiver, subject, template, messageOptions) =>
  new Promise((resolve, reject) => {
    const connection = new SMTPClient({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      requireTLS: true,
      tls: {
        ciphers: 'SSLv3',
      },
      authMethod: 'PLAIN',
    });

    connection.on('error', err => {
      reject(err);
    });

    connection.on('end', () => {
      resolve('Email successfully sent!');
    });

    fs.readFile(
      `${__dirname}/../emailTemplates/${template}.mjml`,
      (readErr, file) => {
        if (readErr) {
          reject(readErr);
        }

        let message;
        try {
          message = mjml(Mustache.render(String(file), messageOptions)).html;
        } catch (mustacheErr) {
          reject(mustacheErr);
        }

        connection.connect(() => {
          connection.login(
            {
              credentials: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              },
            },
            authErr => {
              if (authErr) {
                reject(authErr);
              }
              connection.send(
                {
                  from: process.env.SMTP_SENDER,
                  to: receiver,
                },
                `MIME-Version: 1.0
Subject: ${subject}
From: ${process.env.SMTP_SENDER}
To: ${receiver}
Content-Type: multipart/alternative; boundary="000000000000"

--000000000000
Content-Type: text/html; charset="UTF-8"

${message}`,
                emailErr => {
                  if (emailErr) {
                    reject(emailErr);
                  } else {
                    connection.quit();
                  }
                }
              );
            }
          );
        });
      }
    );
  });

const sendEmailWithRetry = (receiver, subject, template, messageOptions) => {
  let retryCount = 0;
  function sendEmailTry() {
    sendEmail(receiver, subject, template, messageOptions).catch(() => {
      retryCount += 1;
      let timeout;
      if (retryCount <= 3) {
        timeout = 1000;
      } else if (retryCount <= 10) {
        timeout = 60000;
      } else {
        timeout = 3600000;
      }
      setTimeout(sendEmailTry, timeout);
    });
  }
  sendEmailTry();
};

module.exports = {
  sendEmail,
  sendEmailWithRetry,
};
