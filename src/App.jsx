import axios from "axios";
import { useState } from "react";
import ReactiveButton from "reactive-button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import {
  faCircleNotch,
  faThumbsUp,
  faBomb,
} from "@fortawesome/free-solid-svg-icons";
const App = () => {
  const [url, setUrl] = useState(null);
  const [state, setState] = useState("idle");
  const [dataObject, setDataObject] = useState(null);
  const [isExits, setIsExits] = useState(false);
  const [timeLimit, setTimeLimit] = useState(0);
  const [downloadLink, setDownloadLink] = useState(null);

  const baseUrl = import.meta.env.VITE_BASEURL_API;
  const API_Key = import.meta.env.VITE_API_KEY;
  const API_Host = import.meta.env.VITE_BASEURL_HOST;

  const colors = [
    "#004d00", // Dark Green
    "#006400", // Medium Dark Green
    "#008000", // Standard Green
    "#228B22", // Forest Green
    "#32CD32", // Lime Green
    "#7FFF00", // Chartreuse
    "#ADFF2F", // Green Yellow
    "#FFFF00", // Yellow
    "#FFD700", // Gold
    "#FF8C00", // Dark Orange
    "#FF0000", // Red
  ];
  const colorsTime = Array.from(
    { length: colors.length },
    (_, i) => 30 - i * 3
  );
  const onClickHandler = () => {
    setState("loading");

    // Simulate an HTTP request with a setTimeout
    setTimeout(() => {
      try {
        if (downloadLink) {
          window.open(downloadLink, "_blank"); // Open in a new tab
          setState("success");
        } else {
          console.error("Download link is not defined");
          setState("error");
        }
      } catch (error) {
        console.error("Error opening download link:", error);
        setState("error");
      }
    }, 2000); // Simulate a 2-second delay
  };

  /**
   * Converts a time string like "30s" to the number 30.
   * @param {string} timeStr - The time string (e.g., "30s").
   * @returns {number} - The numeric value extracted from the string.
   */
  function convertTimeStringToNumber(timeStr) {
    // Use a regular expression to match digits at the beginning of the string
    const match = timeStr.match(/^(\d+)/);

    // If there is a match, return the number, otherwise return null
    return match ? parseInt(match[1], 10) : null;
  }

  const handelReset = () => {
    setUrl(null);
    setState("idle");
    setDataObject(null);
    setIsExits(false);
    setTimeLimit(0);
    setDownloadLink(null);
  };

  const handelDownload = async () => {
    if (url && url !== null && url !== "") {
      const options = {
        method: "POST",
        url: baseUrl,
        params: {
          url: url,
        },
        headers: {
          "x-rapidapi-key": API_Key,
          "x-rapidapi-host": API_Host,
          "Content-Type": "application/json",
        },
        data: { download: "true" },
      };

      try {
        const response = await axios.request(options);
        const data = response.data;
        const allResponse = data.downloads;
        setTimeLimit(
          convertTimeStringToNumber(allResponse?.file_download?.expire)
        );
        setIsExits(allResponse.status === 200 ? true : false);
        setDownloadLink(allResponse?.file_download?.link);
        setDataObject(data.downloads);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex items-center p-12 lg:p-36 md:p-24 sm:p-12 bg-[#f1f1f1] h-screen w-screen flex-col gap-8 sm:justify-center md:justify-center lg:justify-normal justify-normal lg:gap-16 md:gap-12 sm:gap-8 ">
      <h1 className="px-4 py-1 text-lg font-semibold text-gray-500 rounded-lg bg-[#f0f5eb] drop-shadow-sm">
        EveryDay Downloads Limits: <span className="text-red-500">2 Only</span>
      </h1>
      <h1 className="text-3xl font-bold text-center text-gray-500 sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-lg">
        Download Envato Elements
      </h1>
      {!isExits ? (
        <div className="relative text-gray-600 drop-shadow-lg">
          <input
            type="search"
            name="serch"
            placeholder="envato elements url"
            className="h-10 px-5 pr-10 text-sm bg-white rounded-full focus:outline-none style-input md:w-80 sm:w-80 lg:w-96 w-80"
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            className="absolute top-0 right-0 mt-3 mr-4"
            onClick={handelDownload}
          >
            <svg
              className="w-4 h-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Capa_1"
              x="0px"
              y="0px"
              viewBox="0 0 56.966 56.966"
              xmlSpace="preserve"
              width="512px"
              height="512px"
            >
              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="relative text-gray-600 drop-shadow-lg">
          <div className="flex flex-col items-center justify-center gap-6">
            <p className="flex flex-row items-center justify-center p-1 px-2 rounded-lg bg-green-50">
              <span className="px-3 font-semibold text-center text-white bg-green-600 rounded-lg py-[2px]">
                URL
              </span>{" "}
              <span className="px-3 py-1 text-green-700">{url}</span>
            </p>
            <div className="flex flex-col items-center justify-center w-full gap-6">
              <CountdownCircleTimer
                isPlaying={true}
                duration={30}
                colors={colors}
                colorsTime={colorsTime}
                size={100}
                onUpdate={(remainingTime) => setTimeLimit(remainingTime)}
              >
                {({ remainingTime }) => (
                  <div
                    className={`remaining-time ${
                      remainingTime <= 5 && remainingTime > 0
                        ? "animate-pulse text-red-500"
                        : ""
                    }`}
                  >
                    {remainingTime}s
                  </div>
                )}
              </CountdownCircleTimer>
              {timeLimit !== 0 ? (
                <ReactiveButton
                  buttonState={state}
                  onClick={onClickHandler}
                  color={"primary"}
                  idleText={"Download Me"}
                  loadingText={
                    <>
                      <FontAwesomeIcon icon={faCircleNotch} spin /> Loading
                    </>
                  }
                  successText={
                    <>
                      <FontAwesomeIcon icon={faThumbsUp} /> Success
                    </>
                  }
                  errorText={
                    <>
                      <FontAwesomeIcon icon={faBomb} /> Error
                    </>
                  }
                  type={"button"}
                  className={"class1 class2"}
                  style={{
                    borderRadius: "5px",
                    fontSize: "18px",
                  }}
                  outline={false}
                  shadow={false}
                  rounded={false}
                  size={"large"}
                  block={false}
                  messageDuration={2000}
                  disabled={false}
                  buttonRef={null}
                  width={"15rem"}
                  height={"3rem"}
                  animation={true}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="text-2xl font-bold text-red-500">
                    Download Expired!
                  </p>
                  <p
                    className="text-blue-500 underline cursor-pointer text-normal"
                    onClick={handelReset}
                  >
                    Reset
                  </p>
                </div>
              )}

              <p className="my-5 text-sm">
                <span className="font-bold">Note:</span> Download the file
                before expired the link
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
