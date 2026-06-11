import { NextResponse, type NextRequest } from 'next/server'

/**
 * BuyFlat embeduje kalkulačku na kořeni `/` s `?propertyId=...&token=...`.
 * Veřejný root teď slouží jako landing page, takže embed (rozpoznaný podle
 * `propertyId`) přepíšeme na `/kalkulacka` — URL v adresním řádku zůstává `/`,
 * query parametry se zachovají, BuyFlat nepotřebuje žádnou změnu.
 */
export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  if (pathname === '/' && searchParams.has('propertyId')) {
    const url = req.nextUrl.clone()
    url.pathname = '/kalkulacka'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
