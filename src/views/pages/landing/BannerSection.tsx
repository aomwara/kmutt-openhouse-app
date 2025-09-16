import { Box, Image, } from "@chakra-ui/react";

const BannerSection = () => {
    return (
        <Box as="section"  >

            {/* Banner Full Width */}
            <Box width={{ base: "100%", md: "100%" }} >
                <Image
                    src="/images/banner.jpg"
                    alt="KMUTT Open House 2025 Banner"
                    objectFit="cover"
                    w="100%"
                // h={{ base: "220px", md: "400px", lg: "600px" }}
                />

            </Box>
        </Box>
    );
};

export default BannerSection;
