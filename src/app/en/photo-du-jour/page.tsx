import ApodContent from '@/components/pages/ApodContent'
import { pageMetadata } from '@/lib/config/site'

export const metadata = pageMetadata('/photo-du-jour', 'en')

export default function ApodPage() {
    return <ApodContent locale="en" />
}
