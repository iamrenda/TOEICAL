import React, { useState } from "react";
import { WebView } from "react-native-webview";
import Variables from "@/constants/Variables";

interface Props {
    htmlContent: string;
}

function ExplanationText({ htmlContent }: Props) {
    const [height, setHeight] = useState(0);

    const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-size: 16px;
            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Roboto, "Noto Sans JP", sans-serif;
            line-height: 1.7;
            padding: 12px;
            color: ${Variables.textSecondary};
            margin: 0;
          }
          strong {
            font-weight: 600;
          }
          .color {
            color: #cf2e2e;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          setTimeout(() => {
            const height = document.body.scrollHeight;
            window.ReactNativeWebView.postMessage(height);
          }, 100);
        </script>
      </body>
    </html>
  `;

    return (
        <WebView
            source={{ html }}
            style={{ width: "100%", height }}
            javaScriptEnabled
            scrollEnabled={false}
            onMessage={(event) => setHeight(Number(event.nativeEvent.data))}
        />
    );
}

export { ExplanationText };
