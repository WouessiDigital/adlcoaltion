import Image from "next/image";
import { Header, HomeCard, PolicyAdvocacy, About, Committee, JoinForm} from "../../components/index"


export default function Home() {
  return (
    <div>

      <HomeCard/>
      <About />
      <PolicyAdvocacy/>
      <Committee/>

      </div>
  )
}