import { notFound } from 'next/navigation';
import { WebsiteSectionEditor } from '@/src/components/website/WebsiteSectionEditor';

const sections = ['banners','home','about','academic-activities','programs','gallery','events','admission-information','our-teachers','facilities','achievements','downloads','contact'];
export default async function WebsiteSectionPage({params}:{params:Promise<{section:string}>}){
  const {section}=await params;
  if(!sections.includes(section)) notFound();
  return <WebsiteSectionEditor section={section}/>;
}
