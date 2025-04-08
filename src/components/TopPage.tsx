const TopPage = () => {
  const homeClass = "w-screen h-screen bg-[url('/handshake.jpg')] bg-center bg-cover bg-no-repeat relative"
  const textColor = "text-gray-50"

  return (
    <div className={homeClass}>
      <div className={"absolute inset-0 bg-black opacity-50"}></div>
      <div className="flex justify-center">
        <h1 className={"py-7 text-3xl font-black relative z-10 "  + textColor}>DealSync</h1>
      </div>
      <div className={"flex justify-center relative z-10 " + textColor}>
        <h3 className="">あなたのお金の貸し借りを管理します。</h3>
      </div>
    </div>
  );
};

export default TopPage;
