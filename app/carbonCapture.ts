import puppeteer from 'puppeteer';
import { co2 } from '@tgwf/co2';

export async function getTransferSize(url: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1900,
    height: 1000,
  });

  let totalTransferSize = 0;

  // Enable network tracking to capture transfer sizes
  const client = await page.createCDPSession();
  await client.send('Network.enable');

  client.on('Network.loadingFinished', async (data) => {
    if (data.encodedDataLength >= 0) {
      totalTransferSize += data.encodedDataLength;
    }
  });

  // Navigate to the page and wait for network activity to finish
  await page.goto(url, { waitUntil: 'networkidle2' });

  await browser.close();
  return totalTransferSize;
}

interface SWDOptions {
  dataReloadRatio?: number;
  firstVisitPercentage?: number;
  returnVisitPercentage?: number;
  greenHostingFactor?: number;
  girdIntensity?: {
    device?: number;
    dataCenter?: number;
    networks?: number;
  };
}

export default async function carbonCapture(url: string) {
  // Get size of transferred files
  const transferBytes = await getTransferSize(url);
  console.log('transferBytes', transferBytes);

  // Check if host is green
  const domain = new URL(url);
  const res = await fetch(`https://api.thegreenwebfoundation.org/greencheck/${domain.host.replace('www.', '')}`);
  const greenCheck = await res.json();
  console.log('greenCheck', greenCheck);

  // Get carbon estimate
  const carbon = new co2({ model: 'swd', version: 4, rating: true });
  const options: SWDOptions = {
    dataReloadRatio: 0.02,
    firstVisitPercentage: 1,
    returnVisitPercentage: 0,
  };
  const estimate = carbon.perVisitTrace(transferBytes, greenCheck.green, options);
  console.log(estimate);
  return {
    report: estimate,
    hosting: greenCheck,
  };
}
