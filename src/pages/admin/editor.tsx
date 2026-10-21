import { useEffect } from 'react';

export default function AdminEditorRedirect() {
  useEffect(() => {
    // The CMS is a separate HTML document and needs a full browser navigation.
    window.location.replace(`/admin/index.html${window.location.search}${window.location.hash}`);
  }, []);

  return <p className="px-6 py-32 text-center">Opening the content editor… <a href="/admin/index.html">Continue</a></p>;
}
