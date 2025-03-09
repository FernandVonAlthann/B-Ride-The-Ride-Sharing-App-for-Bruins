(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_3ce736._.js", {

"[project]/src/components/Profile.tsx [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Image from "next/image";
// export default function ProfilePage() {
//   const router = useRouter();
//   const [profile, setProfile] = useState({
//     name: "John Doe",
//     bio: "I love road trips and carpooling!",
//     profilePic: "/default-avatar.png",
//     preferences: {
//       language: "English",
//       ridePreference: "Comfort",
//     },
//   });
//   // Load profile from local storage
//   useEffect(() => {
//     const storedProfile = localStorage.getItem("userProfile");
//     if (storedProfile) {
//       setProfile(JSON.parse(storedProfile));
//     }
//   }, []);
//   // Handle profile picture upload
//   const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfile((prev) => ({ ...prev, profilePic: reader.result as string }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };
//   // Handle text field changes
//   const handleChange = (field: string, value: string) => {
//     setProfile((prev) => ({ ...prev, [field]: value }));
//   };
//   // Handle preference changes
//   const handlePreferenceChange = (field: string, value: any) => {
//     setProfile((prev) => ({
//       ...prev,
//       preferences: { ...prev.preferences, [field]: value },
//     }));
//   };
//   // Save profile to local storage
//   const saveProfile = () => {
//     localStorage.setItem("userProfile", JSON.stringify(profile));
//     alert("Profile saved!");
//   };
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold mb-4">Edit Your Profile</h1>
//       <div className="bg-white p-6 rounded-lg shadow-md w-[400px] text-center">
//         {/* Profile Picture */}
//         <div className="relative w-32 h-32 mx-auto mb-4">
//           <Image
//             src={profile.profilePic}
//             alt="Profile Picture"
//             width={128}
//             height={128}
//             className="rounded-full object-cover border border-gray-300"
//           />
//           <input
//             type="file"
//             accept="image/*"
//             className="absolute inset-0 opacity-0 cursor-pointer"
//             onChange={handleProfilePicChange}
//           />
//         </div>
//         {/* Name Input */}
//         <label className="block font-semibold text-left">Name</label>
//         <input
//           type="text"
//           value={profile.name}
//           onChange={(e) => handleChange("name", e.target.value)}
//           className="border p-2 w-full mb-4"
//         />
//         {/* Bio Input */}
//         <label className="block font-semibold text-left">Bio</label>
//         <textarea
//           value={profile.bio}
//           onChange={(e) => handleChange("bio", e.target.value)}
//           className="border p-2 w-full mb-4 h-20"
//         />
//         {/* Preferences */}
//         <h2 className="text-lg font-semibold mt-4 mb-2">Preferences</h2>
//         {/* Language Selection */}
//         <label className="block font-semibold text-left mt-3">Language</label>
//         <select
//           value={profile.preferences.language}
//           onChange={(e) => handlePreferenceChange("language", e.target.value)}
//           className="border p-2 w-full mb-4"
//         >
//           <option>English</option>
//           <option>Spanish</option>
//           <option>French</option>
//         </select>
//         {/* Ride Preferences */}
//         <label className="block font-semibold text-left">Ride Preference</label>
//         <select
//           value={profile.preferences.ridePreference}
//           onChange={(e) => handlePreferenceChange("ridePreference", e.target.value)}
//           className="border p-2 w-full mb-4"
//         >
//           <option>Comfort</option>
//           <option>Economy</option>
//           <option>Luxury</option>
//         </select>
//         {/* Save Button */}
//         <button onClick={saveProfile} className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4">
//           Save Changes
//         </button>
// 	<Button
//         className="mt-6 bg-gray-500 hover:bg-gray-600 text-white"
//         onClick={() => router.push("/dashboard")}
//       >
//         Back to Dashboard
//       </Button>
//       <Button
//         className="mt-6 bg-gray-500 hover:bg-gray-600 text-white"
//         onClick={() => router.push("/profile")}
//       >
//         Back
//       </Button>
//       </div>
//     </div>
//   );
// }
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/profileapp/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "default": (()=>ProfileAppPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Profile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Profile.tsx [app-client] (ecmascript)"); // Ensure this component exists
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
function ProfileAppPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProfileAppPage.useEffect": ()=>{
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (!storedUser.id) {
                router.push("/login"); // Redirect if no user is found
                return;
            }
            setUserId(storedUser.id);
        }
    }["ProfileAppPage.useEffect"], []);
    if (!userId) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-center mt-10 text-xl",
        children: "Loading..."
    }, void 0, false, {
        fileName: "[project]/src/app/profileapp/page.tsx",
        lineNumber: 22,
        columnNumber: 23
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-gray-100",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Profile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            userId: userId
        }, void 0, false, {
            fileName: "[project]/src/app/profileapp/page.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/profileapp/page.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(ProfileAppPage, "cJpkmLb1nR65fkq0uLLUyQmuk6Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ProfileAppPage;
var _c;
__turbopack_refresh__.register(_c, "ProfileAppPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/profileapp/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
module.exports = __turbopack_require__("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=_3ce736._.js.map