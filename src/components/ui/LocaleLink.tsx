'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import { localizedHref } from '@/lib/i18n/paths'

/** next/link that stays in the current language: « /soleil » becomes « /en/soleil » on English pages. */
export default function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const locale = useSiteLocale()
  return <Link href={typeof href === 'string' ? localizedHref(href, locale) : href} {...props} />
}
