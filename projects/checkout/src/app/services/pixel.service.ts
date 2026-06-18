import { Injectable } from '@angular/core';
import { PixelConfig } from 'models';

@Injectable({ providedIn: 'root' })
export class PixelService {
  private initialized = false;

  init(config: PixelConfig | null): void {
    if (this.initialized || !config) return;
    if (config.facebookPixelId) this.loadFacebook(config.facebookPixelId);
    if (config.googleAdsId)     this.loadGoogle(config.googleAdsId);
    if (config.tiktokPixelId)   this.loadTikTok(config.tiktokPixelId);
    this.initialized = true;
  }

  track(event: 'PageView' | 'InitiateCheckout' | 'Purchase', params?: Record<string, unknown>): void {
    const w = window as Record<string, unknown>;
    const fbq = w['fbq'] as ((...a: unknown[]) => void) | undefined;
    const gtag = w['gtag'] as ((...a: unknown[]) => void) | undefined;
    const ttq  = w['ttq'] as ({ track: (...a: unknown[]) => void }) | undefined;

    if (fbq) fbq('track', event, params ?? {});

    if (gtag) {
      if (event === 'Purchase') {
        gtag('event', 'purchase', { value: params?.['value'], currency: 'BRL' });
      } else if (event === 'InitiateCheckout') {
        gtag('event', 'begin_checkout', { value: params?.['value'], currency: 'BRL' });
      } else {
        gtag('event', 'page_view');
      }
    }

    if (ttq) {
      const tiktokEvent = event === 'Purchase'          ? 'CompletePayment'
                        : event === 'InitiateCheckout'  ? 'InitiateCheckout'
                        : 'ViewContent';
      ttq.track(tiktokEvent, params ?? {});
    }
  }

  private loadFacebook(pixelId: string): void {
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init','${pixelId}');
    `;
    document.head.appendChild(script);
  }

  private loadGoogle(measurementId: string): void {
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(tag);

    const init = document.createElement('script');
    init.innerHTML = `
      window.dataLayer=window.dataLayer||[];
      function gtag(){dataLayer.push(arguments);}
      gtag('js',new Date());gtag('config','${measurementId}');
    `;
    document.head.appendChild(init);
  }

  private loadTikTok(pixelId: string): void {
    const script = document.createElement('script');
    script.innerHTML = `
      !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
      ttq.methods=["page","track","identify","instances","debug","on","off","once","ready",
      "alias","group","enableCookie","disableCookie"];
      ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
      for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
      ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)
      ttq.setAndDefer(e,ttq.methods[n]);return e};
      ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,
      ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");
      o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
      var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load('${pixelId}');ttq.page();}(window,document,'ttq');
    `;
    document.head.appendChild(script);
  }
}
