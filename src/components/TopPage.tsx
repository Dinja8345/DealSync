const TopPage = () => {
  const homeClass = "fixed inset-0 bg-[url('/handshake.jpg')] bg-center bg-cover bg-no-repeat flex flex-col items-center";
  const overlayClass = "absolute inset-0 bg-black opacity-50";
  const textColor = "text-gray-50";
  const headingClass = `text-4xl font-black relative z-10 ${textColor} mt-40`;
  const subheadingClass = `relative z-10 ${textColor}`;

  return (
    <div className={homeClass}>
      <div className={overlayClass}></div>
      <h1 className={headingClass}>DealSync</h1>
      <h3 className={subheadingClass}>あなたのお金の貸し借りを管理します。</h3>
    </div>
  );
};

export default TopPage;