import { INTERCOM_ID } from 'src/utils/constants'

let intercomLoaded = false

export const isIntercomLoaded = () => intercomLoaded

// eslint-disable-next-line consistent-return
export const loadIntercom = (): void => {
  // const APP_ID = INTERCOM_ID
  // if (!APP_ID) {
  //   console.error('[Intercom] - In order to use Intercom you need to add an appID')
  //   return
  // }
  // const d = document
  // const s = d.createElement('script')
  // s.type = 'text/javascript'
  // s.async = true
  // s.src = `https://widget.intercom.io/widget/${APP_ID}`
  // const x = d.getElementsByTagName('script')[0]
  // x?.parentNode?.insertBefore(s, x)

  // s.onload = () => {
  //   ;(window as any).Intercom('boot', {
  //     app_id: APP_ID,
  //     consent: true,
  //   })
  //   intercomLoaded = true
  // }
}

export const closeIntercom = (): void => {
  if (!isIntercomLoaded()) return
  intercomLoaded = false
  ;(window as any).Intercom('shutdown')
}
