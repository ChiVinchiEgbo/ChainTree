let mixpanelLib = null

if (typeof window !== 'undefined') {
  try {
    mixpanelLib = require('mixpanel-browser')
  } catch (e) {
    console.warn('Failed to load mixpanel-browser:', e)
  }
}

const key = process.env.NEXT_PUBLIC_MIX_PANEL_KEY

if (typeof window !== 'undefined' && mixpanelLib) {
  if (key) {
    try {
      mixpanelLib.init(key, {
        ignore_dnt: true,
        debug: process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev',
      })
    } catch (e) {
      console.warn('Mixpanel init failed:', e)
    }
  } else {
    try {
      mixpanelLib.init('00000000000000000000000000000000', {
        autotrack: false,
        opt_out_tracking_by_default: true,
      })
      if (typeof mixpanelLib.disable === 'function') {
        mixpanelLib.disable()
      }
    } catch (e) {
      // Ignore initialization errors when no API key is present
    }
  }
}

const noop = () => {}
const noopPeople = {
  set: noop,
  set_once: noop,
  increment: noop,
  append: noop,
  track_charge: noop,
  clear_charges: noop,
  delete_user: noop,
}

const dummyMixpanel = {
  init: noop,
  track: noop,
  identify: noop,
  disable: noop,
  people: noopPeople,
}

const safeMixpanel = new Proxy(dummyMixpanel, {
  get: (target, prop) => {
    if (typeof window === 'undefined' || !key || !mixpanelLib) {
      if (prop === 'people') return noopPeople
      return noop
    }
    const val = Reflect.get(mixpanelLib, prop)
    if (typeof val === 'function') {
      return (...args) => {
        try {
          return val.apply(mixpanelLib, args)
        } catch (e) {
          console.warn(`Mixpanel ${String(prop)} error:`, e)
        }
      }
    }
    if (prop === 'people' && val) {
      return new Proxy(val, {
        get: (pTarget, pProp) => {
          const pVal = Reflect.get(pTarget, pProp)
          if (typeof pVal === 'function') {
            return (...args) => {
              try {
                return pVal.apply(pTarget, args)
              } catch (e) {
                console.warn(`Mixpanel.people.${String(pProp)} error:`, e)
              }
            }
          }
          return pVal
        },
      })
    }
    return val || noop
  },
})

export { safeMixpanel as mixpanel }